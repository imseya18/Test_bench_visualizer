import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';
import { getSuccessfulJobTypeSize, JobKeys } from '../utils/job-utilities';
import { getJobTypeSize } from '../utils/job-utilities';
import { getJobTypeStatus, getStatusColor } from '../utils/job-utilities';
interface CardProgressBarProps {
  name: JobKeys;
  pipelineJobs: PipelineJobsResponse;
}

export function CardProgressBar({ name, pipelineJobs }: CardProgressBarProps) {
  const SuccessfullJob = getSuccessfulJobTypeSize(pipelineJobs, [name]);
  const totalTests = getJobTypeSize(pipelineJobs, [name]);
  const status = getJobTypeStatus(pipelineJobs, [name]);
  const progressPercentage = SuccessfullJob && totalTests ? (SuccessfullJob / totalTests) * 100 : 0;
  const barColor = getStatusColor(status);
  if (totalTests === 0) return <></>;
  return (
    <>
      <div className='flex justify-between items-center'>
        <span className='text-small text-default-500'>{name}:</span>
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
