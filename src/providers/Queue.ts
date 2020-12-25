import kue, { DoneCallback, Job, JobCallback } from "kue";

import Locals from "./Locals";
import Log from "../middlewares/Log";

class Queue {
  public jobs: any;

  constructor() {
    this.jobs = kue.createQueue({
      prefix: Locals.config().redisPrefix,
      redis: {
        port: Locals.config().redisHttpPort,
        host: Locals.config().redisHttpHost,
        db: Locals.config().redisDB,
      },
    });

    this.jobs
      .on("job enqueue", (id: number, type: string | JobCallback) =>
        Log.info(`Queue :: #${id} Processing of type '${type}'`)
      )
      .on("job complete", (id: number) => this.removeProcessedJob(id));
  }

  public dispatch(jobName: string, args: object, callback: Function): void {
    this.jobs.create(jobName, args).save();

    this.process(jobName, 3, callback);
  }

  private removeProcessedJob(id: number): void {
    Log.info(`Queue :: #${id} Processed`);

    kue.Job.get(id, (err, job) => {
      if (err) {
        return;
      }

      job.remove((err: any) => {
        if (err) {
          throw err;
        }

        Log.info(`Queue :: #${id} Removed Processed Job`);
      });
    });
  }

  private process(jobName: string, count: number, callback: Function): void {
    this.jobs.process(jobName, count, (job: Job, done: DoneCallback) => {
      done(); // Notifies KUE about the completion of the job!

      callback(job.data);
    });
  }
}

export default new Queue();
