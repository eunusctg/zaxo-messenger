import * as admin from 'firebase-admin';

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let adminApp: admin.app.App | null = null;

/**
 * Get or initialize the Firebase Admin app.
 * Used server-side only for:
 * - Verifying FCM tokens
 * - Sending push notifications
 * - Managing Firebase Realtime Database
 */
export function getFirebaseAdmin(): admin.app.App {
  if (adminApp) return adminApp;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    console.warn('[Firebase Admin] Missing credentials. Firebase admin features will be disabled.');
    // Return a dummy app that won't crash
    adminApp = admin.initializeApp({ projectId: 'demo' }, 'zaxo-demo');
    return adminApp;
  }

  adminApp = admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    'zaxo-admin'
  );

  return adminApp;
}

/**
 * Get the Firebase Admin Realtime Database instance
 */
export function getFirebaseDatabase(): admin.database.Database {
  const app = getFirebaseAdmin();
  return app.database();
}

/**
 * Get the Firebase Admin Messaging instance for push notifications
 */
export function getFirebaseMessaging(): admin.messaging.Messaging {
  const app = getFirebaseAdmin();
  return app.messaging();
}

/**
 * Send a push notification for an incoming call
 */
export async function sendCallNotification(params: {
  targetToken: string;
  callerName: string;
  callId: string;
  callType: 'audio' | 'video';
  roomName: string;
  callerId: string;
}): Promise<string | null> {
  try {
    const messaging = getFirebaseMessaging();
    const message: admin.messaging.Message = {
      token: params.targetToken,
      notification: {
        title: `Incoming ${params.callType === 'video' ? 'Video' : 'Audio'} Call`,
        body: `${params.callerName} is calling you on Zaxo`,
      },
      data: {
        type: 'incoming_call',
        callId: params.callId,
        callType: params.callType,
        roomName: params.roomName,
        callerId: params.callerId,
        callerName: params.callerName,
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'zaxo-calls',
          clickAction: 'INCOMING_CALL',
          sound: 'ringtone',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: `Incoming ${params.callType === 'video' ? 'Video' : 'Audio'} Call`,
              body: `${params.callerName} is calling you on Zaxo`,
            },
            sound: 'ringtone',
            'content-available': 1,
            'push-type': 'voip',
          },
        },
      },
    };

    const response = await messaging.send(message);
    console.log('[FCM] Call notification sent:', response);
    return response;
  } catch (error) {
    console.error('[FCM] Error sending call notification:', error);
    return null;
  }
}

/**
 * Send a push notification for a new message
 */
export async function sendMessageNotification(params: {
  targetToken: string;
  senderName: string;
  messagePreview: string;
  chatId: string;
  senderId: string;
}): Promise<string | null> {
  try {
    const messaging = getFirebaseMessaging();
    const message: admin.messaging.Message = {
      token: params.targetToken,
      notification: {
        title: params.senderName,
        body: params.messagePreview,
      },
      data: {
        type: 'new_message',
        chatId: params.chatId,
        senderId: params.senderId,
        senderName: params.senderName,
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'zaxo-messages',
          clickAction: 'NEW_MESSAGE',
        },
      },
    };

    const response = await messaging.send(message);
    console.log('[FCM] Message notification sent:', response);
    return response;
  } catch (error) {
    console.error('[FCM] Error sending message notification:', error);
    return null;
  }
}
