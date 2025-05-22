import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';
import {
  getJobTypeStatus,
  getStatusColor,
  getSuccessfulJobTypeSize,
  JobKeys,
  getJobTypeSize,
  getJobTestTypeSize,
  getSuccessfulJobTestTypeSize,
} from '../utils/job-utilities';
interface CardProgressBarProps {
  type: JobKeys;
  pipelineStatus: string;
  pipelineJobs: PipelineJobsResponse;
}

export function CardProgressBar({ type, pipelineJobs, pipelineStatus }: CardProgressBarProps) {
  let SuccessfullJob = 0;
  let totalTests = 0;
  if (type === 'build' || pipelineStatus === 'running') {
    SuccessfullJob = getSuccessfulJobTypeSize(pipelineJobs, [type]);
    totalTests = getJobTypeSize(pipelineJobs, [type]);
  } else {
    SuccessfullJob = getSuccessfulJobTestTypeSize(pipelineJobs, [type]);
    totalTests = getJobTestTypeSize(pipelineJobs, [type]);
  }
  const status = getJobTypeStatus(pipelineJobs, [type]);
  const progressPercentage = SuccessfullJob && totalTests ? (SuccessfullJob / totalTests) * 100 : 0;
  const barColor = getStatusColor(status);
  if (totalTests === 0) return <></>;
  return (
    <>
      <div className='flex justify-between items-center'>
        <span className='text-small text-default-500'>{type}:</span>
        <span className='text-small font-medium'>
          {SuccessfullJob}/{totalTests}
        </span>
      </div>

      <div
        className={`w-full bg-default-100 rounded-full h-2 mt-1 ${
          SuccessfullJob === 0 ? `border-1 border-${barColor}` : ''
        }`}
      >
        <div
          className={`h-2 rounded-full bg-${barColor}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </>
  );
}
