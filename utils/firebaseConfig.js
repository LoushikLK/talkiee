const admin = require("firebase-admin");

const app = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail:
      "firebase-adminsdk-vzfdk@talkiee-949f5.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCos2hU+nNAPAZ7\nmpEoSnrmhYUj7B3BRtPueunwU4V7ugC3iSOxyYuPeKPRu+h2Y9RzNgKMyQ+PiEDF\nLAe0elrfjCaBspY8Aw5jCwFWXN3GrxKWGJ4D9aMdeT9pNHvHtJpyrpYOJq+dXwEm\n2fj63hu8pqn52jl+tm98HPia4w9oVkmbwofHlyTKRbEN63IEvXke6lECHraTF+BM\nMf9R1KiD5KEn9E8xMIwmjB4QpMsnqq4Kq5Ibo8UVkn0N0Z69AeviUbpTG0TgubDs\n4c31FaXHX7TgtkV93nmvWvQnD6cSuU1BZUS6KLgBi5pe8mwR+8HGjGclAiSiGQ2n\n8eZDq/7xAgMBAAECggEAQY3ZpG/f+h15HW3OKzxp7osC1hcp5tF5iCmeH0OtUotQ\nPQGe67aYMyubaOQebGbVhuF9cyysDcfR92xpIBINnuGMkwiNBYvges8reV5D1bFx\nRP8S5BH/DPRxFhYNZWiCPb8m0x/oTPw+a9T2wbEuUQvocA0DG4CT6MQvPKyv74g6\ns45Rae/iy0//C1PAvQ2x4FjkVdccj/JjukDsORUbo3aMvq25yn6zVPvJOLGScKM9\n/DtTab52VQp6YOKSGisHIBETyAmFGHH0NdQdhUWs1LUaYxv/lGlyzzDoLT134Clo\nH9VH3W+8Bm70/9ewDTw3lz1SRS39KnH6Q2qvBa2uwwKBgQDScOYYOmwZrMe2K3hj\nWy8FxslWT5QvvdQor+nNE6BThhEA+9JCMkeJZVtWuIXo9siAci5cu5lNRi9L8ofA\nGrTTkH9jAoeYXwJomzEuLxWKg8x+TMl5MBdufnWhWP9Dxg8JHIzAWnJ0JpCJHq/0\n183+PrnWk+aKL1nlxnNlh9UGYwKBgQDNOSzvk5av/O3s27I9uYU2jUNjC1RlN5kJ\nEFXxdH/O8mAEBVNwSUxXKbl4Ln2YnDJBJJJNUwjIkPLhx39CGa1oyc4pKbYOjF76\n/4DKiufA44uAhXSnlpeJ7O3f1sSYs5/LMNbZ9omaP86EBsxQzsQUU8wOQJNE1mKG\nkM8VbO+rmwKBgQDBO63svWiZws+3dP8crJPnB/vEZ1o45GQ14CIdj1H+n/JpJtKQ\nuj556ToPzWwY2NKPL0lnGVPRYwr3AAKq4Vr9kYeHUMFVppg9mZN1RwLOp+tUZgny\nX7iEW1aEC4aJowoXYcHUtri18ttxLV6AwtCCDvLyF+jvJj+z/5/isPFo5QKBgQDF\nmS25KARJQ2HbU9YVNJIdanrd3MTQCG5jmcUGjcOaASmN9YrXbNwCePxJyYnI7Ww9\n6PatWSv14gradfoELTEY2maUn8LZ0zKIvobFfmWTBgUGJHmj+43Bkc2gXuxAk4Ni\nY44bpBPt3037NYh4rf2CDQVHG8ow17NaGggqew9xzQKBgHu7GL3IZzlCqN5gf31g\nCeYCqj0gGA/N1mRYgQzQFdcnw8F5TC8p3ydQQIdRG4/wdzR8NOZIi/99dm8sZpo7\nZBZ2C1skMiVOBYUdwlrZvfKIpCobBHMG7EZL5xJcDZiNqurWRrDVrZP11CEHDCh8\nFtJab3ZkK45bg6xf4wO/Mbg7\n-----END PRIVATE KEY-----\n",
    projectId: "talkiee-949f5",
  }),
});

const serverAuth = app.auth();

const checkUser = async (req, res, next) => {
  try {
    // console.log("checking user");
    if (!req.body.idToken) {
      return res.status(401).json({
        message: "No token provided",
        data: {},
        error: "No token provided",
      });
    }

    const verified = await serverAuth.verifyIdToken(req.body.idToken);
    if (!verified) {
      return res.status(401).json({
        message: "Invalid token",
        data: {},
        error: "Invalid token",
      });
    } else {
      await serverAuth.deleteUser(verified.uid);
      return next();
    }
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: "Something went wrong",
      data: {},
      error: error?.message,
    });
  }
};

module.exports = checkUser;
