import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
exports.getChangedBooking = functions.firestore.document('booking/{bookingId}').onUpdate(async (updated) => {
	const document = updated.after.data();
	const CustomerId = document.CustomerId;
	const contentWasChangedName = document.CurrentStatus.Name;
	const contentWasChangedByCustomer = document.CurrentStatus.CreatedByCustomer;
	const seenFalse = document.SeenByCustomer;
	let messageBody = '';
	let orderId = 0;

	if ((contentWasChangedName === 'Created order' && contentWasChangedByCustomer === false && !seenFalse) || (contentWasChangedName === 'Cancel' && contentWasChangedByCustomer === false && !seenFalse)) {
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
	} else {
		return null;
	}

});

exports.getChangedChat = functions.firestore.document('chat/{chatId}').onUpdate(async (updated) => {
	const document = updated.after.data();
	const CustomerId = document.cusId;
	const supplierName = document.supName;
	const seenByCus = document.seenByCus;
	let messageBodyChat = '';

	if (seenByCus === false) {
		messageBodyChat = 'Đã gửi tin nhắn cho bạn';
		const payloadChat = {
			notification: {
				title: supplierName,
				body: `${messageBodyChat}`
			},
			data: {
				'MessageBody': "Bạn có tin nhắn mới",
				'Document': '1'
			}
		};
		const devicesRef = admin.firestore().collection('devices').where('CustomerId', '==', CustomerId);
		const devices = await devicesRef.get();
		const tokens = [];
		devices.forEach(device => {
			const token = device.data().token;
			tokens.push(token);
		});
		return admin.messaging().sendToDevice(tokens, payloadChat);
	} else {
		return null;
	}
});
