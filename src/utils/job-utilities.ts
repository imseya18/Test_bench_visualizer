import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';

export type JobKeys = 'build' | 'cve' | 'test' | 'test_offline';
export type JobStatus = 'running' | 'completed' | 'failed' | 'pending' | 'success';
export const jobKeys: JobKeys[] = ['build', 'cve', 'test', 'test_offline'];

export const getJobSize = (pipeline: PipelineJobsResponse) => {
  const jobLen = jobKeys.reduce((sum, type) => sum + pipeline[type].length, 0);
  return jobLen;
};

export const getSuccesfulJobSize = (pipeline: PipelineJobsResponse) => {
  let success = 0;
  for (const type of jobKeys) {
    success += pipeline[type].filter((job) => job.status === 'success').length;
  }
  return success;
};

export const getStatusColor = (status: JobStatus) => {
  const colors = {
    running: 'primary',
    completed: 'success',
    failed: 'danger',
    pending: 'warning',
    success: 'success',
  };
  return colors[status] || 'default';
};
