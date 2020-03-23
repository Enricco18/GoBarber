/* eslint-disable no-console */
import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handler }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handler,
      };
    });
  }

  add(queue, job) {
    this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handler } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handler);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name} : Failed`, err);
  }
}

export default new Queue();
