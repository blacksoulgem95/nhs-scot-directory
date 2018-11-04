import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as csv from 'csvtojson';
import * as maps from '@google/maps';
import path = require('path');
import os = require('os');
import fs = require('fs');

admin.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));

const googleMapsClient = maps.createClient({
    key: functions.config().google.maps.clientkey
});

export const fillLatLng = functions.firestore.document("doctors/{doctorId}")
    .onWrite(async (snap, context) => {
        if (snap.after.exists) {
            const data = snap.after.data();
            if (!!data.geopoint) return true;

            const address = `${data.AddressLine1} ${data.AddressLine2} ${data.AddressLine3} ${data.AddressLine4} ${data.Postcode}`;

            return new Promise((r, rj) => {
                googleMapsClient.geocode({
                    address: address
                }, async (error, result) => {
                    if (error) {
                        console.error("error geocoding address", error);
                        rj(error);
                    } else {
                        try {
                            console.log("got result for address", address, result.json);
                            const lat = result.json.results[0].geometry.location.lat;
                            const lng = result.json.results[0].geometry.location.lng;

                            await snap.after.ref.update({"geopoint": new admin.firestore.GeoPoint(lat, lng)});
                            r(true);
                        } catch (error) {
                            console.error("error saving geocoded address", address, error);
                            rj(error);
                        }
                    }
                });
            });
        } else {
            return false;
        }
    });

export const triggerRegeneration = functions.storage.object().onFinalize(async (object) => {

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.

    const fileName = path.basename(filePath, path.extname(filePath));

    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    try {
        await bucket.file(filePath).download({
            destination: tempFilePath,
        });
        console.log('CSV downloaded locally to', tempFilePath);
        const data = await csv().fromFile(tempFilePath);

        console.log("deleting old data");
        try {
            await deleteCollection(admin.firestore(), "doctors", 20);
        } catch (error) {
            console.warn("cannot delete previous data", error);
        }
        console.log("saving new data");
        await batchSaveData(admin.firestore(), "doctors", data);

        console.log("deleting old file");
        await bucket.file(filePath).delete();

    } catch (error) {
        console.error("error uploading new doctor data", error);
        throw error;
    } finally {
        console.log("emptying TMP folder");
        fs.unlinkSync(tempFilePath);
    }
});

async function batchSaveData(db, collectionPath, data) {
    const collectionRef = db.collection(collectionPath);

    const promises = [];
    let batch = db.batch();

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const ref = collectionRef.doc(d.GPPractice);
        batch.set(ref, d);
        if (((i + 1) % 250) === 0) {
            promises.push(batch.commit());
            batch = db.batch();
        }
    }

    return Promise.all(promises);
}

function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    })
        .catch(reject);
}