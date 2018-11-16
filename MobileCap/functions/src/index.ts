import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
exports.getChangedBooking = functions.firestore.document('booking/{bookingId}').onUpdate(async (updated) => {
  const document = updated.after.data();
  const CustomerId = document.CustomerId;
  const contentWasChanged = document.CurrentStatus.Name;
  let messageBody = '';
  let orderId = 0;
  if (contentWasChanged === 'Waiting for review') {
    messageBody = 'Gửi yêu cầu thành công';
  } else if (contentWasChanged === 'Created order') {
    messageBody = 'Yêu cầu được chấp nhận';
    orderId = document.OrderId;
  } else {
    messageBody = 'Yêu cầu không được chấp nhận';
  }
  const payload = {
    notification: {
      title: 'Thông báo',
      body: `${messageBody}`
    },
    data: {
      'OrderId': orderId + '',
      'MessageBody': messageBody
    }
  };
  const devicesRef = admin.firestore().collection('devices').where('CustomerId', '==', CustomerId);
  const devices = await devicesRef.get();
  const tokens = [];
  devices.forEach(device => {
    const token = device.data().token;
    tokens.push(token);
  });
  return admin.messaging().sendToDevice(tokens, payload);
});
