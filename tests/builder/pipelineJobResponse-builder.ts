import { PipelineJobsResponse } from '../src/bindings/PipelineJobsResponse';
import { JobBuilder } from '././job-builder';

export class PipelineJobsResponseBuilder {
  private _id: bigint;
  private _title: string;
  private _ref: string;
  private _status: string;
  private _project_id: bigint;
  private _created_at: string;
  private _updated_at: string;

  private _buildJobs: Array<JobBuilder>;
  private _cveJobs: Array<JobBuilder>;
  private _testJobs: Array<JobBuilder>;
  private _testOfflineJobs: Array<JobBuilder>;
  private _unknownJobs: Array<JobBuilder>;

  constructor() {
    this._id = BigInt(1);
    this._title = 'Default Pipeline';
    this._ref = 'refs/heads/main';
    this._status = 'success';
    this._project_id = BigInt(42);
    const nowIso = new Date().toISOString();
    this._created_at = nowIso;
    this._updated_at = nowIso;

    this._buildJobs = [];
    this._cveJobs = [];
    this._testJobs = [];
    this._testOfflineJobs = [];
    this._unknownJobs = [];
  }

  withId(id: bigint | number): this {
    this._id = BigInt(id);
    return this;
  }

  withTitle(title: string): this {
    this._title = title;
    return this;
  }

  withRef(ref: string): this {
    this._ref = ref;
    return this;
  }

  withStatus(status: string): this {
    this._status = status;
    return this;
  }

  withProjectId(pid: bigint | number): this {
    this._project_id = BigInt(pid);
    return this;
  }

  withCreatedAt(isoString: string): this {
    this._created_at = isoString;
    return this;
  }

  withUpdatedAt(isoString: string): this {
    this._updated_at = isoString;
    return this;
  }

  withBuildJobs(jobBuilders: JobBuilder[]): this {
    this._buildJobs = jobBuilders;
    return this;
  }

  addBuildJob(jobBuilder: JobBuilder): this {
    this._buildJobs.push(jobBuilder);
    return this;
  }

  withCveJobs(jobBuilders: JobBuilder[]): this {
    this._cveJobs = jobBuilders;
    return this;
  }

  addCveJob(jobBuilder: JobBuilder): this {
    this._cveJobs.push(jobBuilder);
    return this;
  }

  withTestJobs(jobBuilders: JobBuilder[]): this {
    this._testJobs = jobBuilders;
    return this;
  }

  addTestJob(jobBuilder: JobBuilder): this {
    this._testJobs.push(jobBuilder);
    return this;
  }

  withTestOfflineJobs(jobBuilders: JobBuilder[]): this {
    this._testOfflineJobs = jobBuilders;
    return this;
  }

  addTestOfflineJob(jobBuilder: JobBuilder): this {
    this._testOfflineJobs.push(jobBuilder);
    return this;
  }

  withUnknownJobs(jobBuilders: JobBuilder[]): this {
    this._unknownJobs = jobBuilders;
    return this;
  }

  addUnknownJob(jobBuilder: JobBuilder): this {
    this._unknownJobs.push(jobBuilder);
    return this;
  }

  build(): PipelineJobsResponse {
    return {
      id: this._id,
      title: this._title,
      ref: this._ref,
      status: this._status,
      project_id: this._project_id,
      created_at: this._created_at,
      updated_at: this._updated_at,
      build: this._buildJobs.map((jb) => jb.build()),
      cve: this._cveJobs.map((jb) => jb.build()),
      test: this._testJobs.map((jb) => jb.build()),
      test_offline: this._testOfflineJobs.map((jb) => jb.build()),
      unknown: this._unknownJobs.map((jb) => jb.build()),
    };
  }
}
