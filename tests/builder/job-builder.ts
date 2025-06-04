// src/builders/JobBuilder.ts

import { Job } from '../src/bindings/Job';
import { TestSuite } from '../src/bindings/TestSuite';
import { Commit } from '../src/bindings/Commit';

export class JobBuilder {
  private _commit: Commit;
  private _id: bigint;
  private _name: string;
  private _tag_list: Array<string>;
  private _stage: string;
  private _status: string;
  private _tests_report: TestSuite | null;

  constructor() {
    this._commit = {
      title: 'default-title',
    };

    this._id = BigInt(100);
    this._name = 'default-job';
    this._tag_list = [];
    this._stage = 'build';
    this._status = 'success';
    this._tests_report = null;
  }

  // Permet d’overrider entièrement l’objet commit
  withCommit(commit: Commit): this {
    this._commit = commit;
    return this;
  }

  withId(id: bigint | number): this {
    this._id = BigInt(id);
    return this;
  }

  withName(name: string): this {
    this._name = name;
    return this;
  }

  withTagList(tags: Array<string>): this {
    this._tag_list = tags;
    return this;
  }

  addTag(tag: string): this {
    this._tag_list.push(tag);
    return this;
  }

  withStage(stage: string): this {
    this._stage = stage;
    return this;
  }

  withStatus(status: string): this {
    this._status = status;
    return this;
  }

  withTestsReport(report: TestSuite | null): this {
    this._tests_report = report;
    return this;
  }

  build(): Job {
    return {
      commit: { ...this._commit },
      id: this._id,
      name: this._name,
      tag_list: [...this._tag_list],
      stage: this._stage,
      status: this._status,
      tests_report: this._tests_report,
    };
  }
}
