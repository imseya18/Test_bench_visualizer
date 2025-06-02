import { Job } from '../bindings/Job';
import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';

export type JobKeys = 'build' | 'cve' | 'test' | 'test_offline';
export const jobKeys: JobKeys[] = ['build', 'cve', 'test_offline', 'test'];

export const JOB_STATUS_CONFIG = {
  running: { priority: 1, color: 'primary', icon: 'lucide:loader-2' },
  manual: { priority: 2, color: 'default', icon: 'lucide:clock' },
  pending: { priority: 3, color: 'warning', icon: 'lucide:clock' },
  preparing: { priority: 4, color: 'warning', icon: 'lucide:clock' },
  scheduled: { priority: 5, color: 'default', icon: 'lucide:clock' },
  waiting_for_resource: { priority: 6, color: 'warning', icon: 'lucide:clock' },
  failed: { priority: 7, color: 'danger', icon: 'lucide:x' },
  success: { priority: 8, color: 'success', icon: 'lucide:check' },
  canceling: { priority: 9, color: 'warning', icon: 'material-symbols:cancel-outline-rounded' },
  canceled: { priority: 10, color: 'default', icon: 'material-symbols:cancel-outline-rounded' },
  created: { priority: 11, color: 'default', icon: 'lucide:clock' },
  skipped: { priority: 12, color: 'default', icon: 'material-symbols:cancel-outline-rounded' },
} as const;

export type JobStatus = keyof typeof JOB_STATUS_CONFIG;
export type JobPriority = (typeof JOB_STATUS_CONFIG)[JobStatus]['priority'];
export type JobColor = (typeof JOB_STATUS_CONFIG)[JobStatus]['color'];
export type JobIcon = (typeof JOB_STATUS_CONFIG)[JobStatus]['icon'];
export const getJobTypeSize = (
  pipeline: PipelineJobsResponse,
  keys: JobKeys[] = jobKeys,
): number => {
  const jobLen = keys.reduce((sum, type) => sum + pipeline[type].length, 0);
  return jobLen;
};
function normalizeTotal(count?: bigint): number {
  if (count === undefined) return 0;
  if (count == 0n) return 1;
  return Number(count);
}

export const getJobTestTypeSize = (
  pipeline: PipelineJobsResponse,
  keys: JobKeys[] = jobKeys,
): number => {
  const jobLen = keys.reduce(
    (sum, type) =>
      sum +
      pipeline[type].reduce(
        (sum, job) => sum + normalizeTotal(job.tests_report?.total_count ?? BigInt(1)),
        0,
      ),
    0,
  );
  return jobLen;
};

export const getSuccessfulJobTestTypeSize = (
  pipeline: PipelineJobsResponse,
  keys: JobKeys[] = jobKeys,
): number => {
  let success = 0;
  for (const type of keys) {
    success += pipeline[type].reduce(
      (sum, successfulJob) => sum + Number(successfulJob.tests_report?.success_count ?? 0),
      0,
    );
  }
  return success;
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

export function getJobPriority(status: JobStatus): JobPriority {
  return JOB_STATUS_CONFIG[status].priority;
}

export function getStatusColor(status: JobStatus): JobColor {
  return JOB_STATUS_CONFIG[status].color;
}

export function getStatusIcon(status: JobStatus): JobIcon {
  return JOB_STATUS_CONFIG[status].icon;
}

//* Not 100% Sure about the behavior, Modify this function if that doesn't match the Error
export function checkUnexpectedCase(job: Job) {
  if (Number(job.tests_report?.total_count) === 0) {
    return 'Unexpected Behavior: Possibly Failed At Flashing';
  } else if (job.tests_report?.total_count === job.tests_report?.success_count) {
    return 'Unexpected Behavior: Internal Error';
  }
  return '';
}

export function typeIsTest(type: JobKeys): boolean {
  if (type === 'test' || type === 'test_offline') return true;
  return false;
}
