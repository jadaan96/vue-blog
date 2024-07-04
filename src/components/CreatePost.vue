<template>
  <div class="container mt-5">
    <h1 class="mb-4">{{ isEditing ? 'Edit Post' : 'Create Post' }}</h1>
    <form @submit.prevent="handleSubmit" class="row g-3 border border-2 rounded p-4 mb-4">
      <!-- Form inputs -->
      <div class="col-md-6">
        <label for="title" class="form-label">Title:</label>
        <input type="text" id="title" class="form-control" v-model="title" required>
      </div>
      <div class="col-md-6">
        <label for="description" class="form-label">Description:</label>
        <textarea id="description" class="form-control" v-model="description" rows="3" required></textarea>
      </div>
      <div class="col-md-4">
        <label for="time" class="form-label">Time:</label>
        <div class="d-flex">
          <input type="number" min="1" max="12" class="form-control me-2" v-model="timeParts.hours" placeholder="HH">
          <input type="number" min="0" max="59" class="form-control me-2" v-model="timeParts.minutes" placeholder="MM">
          <input type="number" min="0" max="59" class="form-control me-2" v-model="timeParts.seconds" placeholder="SS">
          <select class="form-control" v-model="timeParts.period">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
      <div class="col-md-6 d-flex align-items-end">
        <button type="button" class="btn btn-primary me-2" @click="startTimer" :disabled="timer">Start</button>
        <button type="button" class="btn btn-secondary me-2" @click="stopTimer" :disabled="!timer">Stop</button>
        <button type="button" class="btn btn-success" @click="saveTimer">Save</button>
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-success mt-3">{{ isEditing ? 'Update' : 'Save' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import { savePosts, loadPosts } from '../../utils/localStorage';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default {
  props: ['id'],
  data() {
    return {
      title: '',
      description: '',
      time: '',
      timer: null,
      posts: [],
      isEditing: false,
      postId: null,
      timeParts: {
        hours: '',
        minutes: '',
        seconds: '',
        period: 'AM'
      }
    };
  },
  computed: {
    formattedTime() {
      if (!this.time) return '';
      const date = new Date(this.time);
      return date.toLocaleTimeString('en-US', { hour12: true });
    }
  },
  mounted() {
    this.posts = loadPosts();
    if (this.id) {
      this.isEditing = true;
      this.loadPostData(this.id);
    }
  },
  methods: {
startTimer() {
  if (!this.timer) {
    let timestamp = this.time ? this.convertTimeToTimestamp(this.time) : Date.now();
    
    this.timer = setInterval(() => {
      timestamp += 1000;
      const currentDate = new Date(timestamp);
       currentDate.toString();
      this.timeParts.hours = currentDate.getHours() % 12 || 12;
      this.timeParts.minutes = currentDate.getMinutes();
      this.timeParts.seconds = currentDate.getSeconds();
      this.timeParts.period = currentDate.getHours() >= 12 ? 'PM' : 'AM';
    }, 1000);
  }
},


    saveTimer() {
      const hours = parseInt(this.timeParts.hours, 10);
      const minutes = parseInt(this.timeParts.minutes, 10);
      const seconds = parseInt(this.timeParts.seconds, 10);
      const period = this.timeParts.period;

      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || !period) {
        alert('Please enter a valid time.');
        return;
      }

      const timeString = `${hours}:${minutes}:${seconds} ${period}`;
      this.time = this.convertTimeToTimestamp(timeString);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    convertTimeToTimestamp(timeString) {
      const currentDate = new Date();
      const [time, period] = timeString.split(' ');
      let [hours, minutes, seconds] = time.split(':');

      hours = parseInt(hours, 10);
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }

      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);
      currentDate.setSeconds(seconds);

      return currentDate.getTime();
    },
    handleSubmit() {
      if (!this.time) {
        const newTime = Date.now();
        this.time = newTime;
      }
      if (this.isEditing) {
        this.updatePost();
      } else {
        this.createPost();
      }
    },
    createPost() {
      const newPost = {
        id: Date.now(),
        title: this.title,
        description: this.description,
        time: this.formattedTime,
      };
      this.posts.push(newPost);
      savePosts(this.posts);
      this.resetForm();
      this.showNotification('success', 'Post Created Successfully');
      this.$router.push('/post');
    },
    updatePost() {
      const postIndex = this.posts.findIndex(post => post.id === parseInt(this.id));
      if (postIndex !== -1) {
        if (typeof this.time === 'string') {
          this.time = this.convertTimeToTimestamp(this.time)
        }
        this.posts[postIndex] = {
          id: parseInt(this.id),
          title: this.title,
          description: this.description,
          time: this.formattedTime,
        };
        savePosts(this.posts);
        this.resetForm();
        this.showNotification('success', 'Post Updated Successfully');
        this.$router.push('/');
      }
    },
    loadPostData(id) {
      const post = this.posts.find(post => post.id === parseInt(id));
      console.log(post);

      if (post) {
        this.title = post.title;
        this.description = post.description;
        const times =  this.convertTimeToTimestamp(post.time)
        const date = new Date(times);
        this.timeParts.hours = date.getHours() % 12 || 12;
        this.timeParts.minutes = date.getMinutes();
        this.timeParts.seconds = date.getSeconds();
        this.timeParts.period = date.getHours() >= 12 ? 'PM' : 'AM';
        this.time = post.time;
      }
    },
    resetForm() {
      this.title = '';
      this.description = '';
      this.time = '';
      this.timeParts = { hours: '', minutes: '', seconds: '', period: 'AM' };
      this.stopTimer();
      this.isEditing = false;
      this.postId = null;
    },
    showNotification(icon, message) {
      Swal.fire({
        icon: icon,
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    }
  }
};
</script>

<style scoped>
/* Add scoped styles specific to this component */
</style>
