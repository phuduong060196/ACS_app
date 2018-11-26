import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
exports.getChangedBooking = functions.firestore.document('booking/{bookingId}').onUpdate(async (updated) => {
	const document = updated.after.data();
	const CustomerId = document.CustomerId;
	const contentWasChangedName = document.CurrentStatus.Name;
	const contentWasChangedByCustomer = document.CurrentStatus.CreatedByCustomer;
	let messageBody = '';
	let orderId = 0;
	if (contentWasChangedName === 'Created order' && contentWasChangedByCustomer === false) {
		messageBody = 'Yêu cầu được chấp nhận';
		orderId = document.OrderId;
	} else if (contentWasChangedName === 'Cancel' && contentWasChangedByCustomer === false) {
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
