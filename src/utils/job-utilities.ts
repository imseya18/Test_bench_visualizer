import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';

export type JobKeys = 'build' | 'cve' | 'test' | 'test_offline';
export type JobStatus = 'running' | 'completed' | 'failed' | 'pending' | 'success';
export const jobKeys: JobKeys[] = ['build', 'cve', 'test', 'test_offline'];

export const getJobTypeSize = (
  pipeline: PipelineJobsResponse,
  keys: JobKeys[] = jobKeys,
): number => {
  const jobLen = keys.reduce((sum, type) => sum + pipeline[type].length, 0);
  return jobLen;
};

export const getSuccessfulJobTypeSize = (
  pipeline: PipelineJobsResponse,
  keys: JobKeys[] = jobKeys,
): number => {
  let success = 0;
  for (const type of keys) {
    success += pipeline[type].filter((job) => job.status === 'success').length;
  }
  return success;
};

export const getJobTypeStatus = (
  pipeline: PipelineJobsResponse,
  keys: JobKeys[] = jobKeys,
): JobStatus => {
  let status;
  for (const type of keys) {
    for (const job of pipeline[type]) {
      if (job.status === 'failed') {
        status = 'failed';
      }
      if (job.status === 'running' || job.status === 'pending' || job.status === 'preparing')
        return 'running';
    }
  }

  return (status as JobStatus) || 'success';
};

export const getStatusColor = (status: JobStatus): string => {
  const colors = {
    running: 'primary',
    completed: 'success',
    failed: 'danger',
    pending: 'warning',
    success: 'success',
  };
  return colors[status] || 'default';
};
