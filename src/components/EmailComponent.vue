<template>
    <div v-if="visible" class="modal-overlay">
      <div class="modal">
        <form @submit.prevent="sendEmail">
          <h3>Email Form</h3>
  
          <label for="to">Recipient Email</label>
          <input type="email" v-model="emailData.to" required />
  
          <label for="subject">Subject</label>
          <input type="text" v-model="emailData.subject" required />
  
          <label for="message">Message (Optional)</label>
          <textarea v-model="emailData.message"></textarea>
  
          <label for="fileID">File ID</label>
          <input type="text" v-model="emailData.fileID" required />
  
          <div class="modal-actions">
            <button type="submit">Send Email</button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
<script>
import { defineComponent, ref } from 'vue';
import api from '../utils/api'; // Replace with your Axios instance path
import { useToast } from 'vue-toastification';

export default defineComponent({
  name: 'EmailComponent',

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    fileID: {
      type: String,
      required: true,
    },
  },

  emits: ['close'],

//   setup(_, { emit, props }) {
  setup(props, { emit }) {
    const toast = useToast();
    const emailData = ref({
      to: '',
      subject: '',
      message: '',
      fileID: props.fileID, // Pre-fill with fileID from props
    });

    const sendEmail = async () => {
      try {
        // const response = await api.post('/SendEmail', emailData.value)
      const response = await api.post('/SendEmail', emailData.value);
        // const response =  await api.get(`/SendEmail/dsadsdsadsd`)

        if (response.data.success) {
          toast.success('Email sent successfully!');
          closeModal();
        } else {
          toast.error('Failed to send email. Please try again.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        toast.error('An error occurred while sending the email.');
      }
    };

    const closeModal = () => {
      emit('close');
    };

    return {
      emailData,
      sendEmail,
      closeModal,
    };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>