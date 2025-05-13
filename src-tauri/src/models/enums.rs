use std::{fmt, str::FromStr};

use std::convert::Infallible;

#[derive(Debug, PartialEq)]
pub enum JobType {
    Build,
    Test,
    CveScan,
    TestOffline,
    Unknown,
}

impl FromStr for JobType {
    // As our from_str implementation doesn't return an error in any case we can use the Infallible enum
    type Err = Infallible;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "build" => JobType::Build,
            "test-offline" => JobType::TestOffline,
            "test" => JobType::Test,
            "cvescan" => JobType::CveScan,
            _ => JobType::Unknown,
        })
    }
}

#[derive(Debug)]
pub enum ProjectId {
    Ci,
}

impl fmt::Display for ProjectId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            ProjectId::Ci => "45354308",
        };
        f.write_str(s)
    }
}

// pub fn get_job_type(type_of_job: &str) -> JobType {
//     match type_of_job {
//         "build" => JobType::Build,
//         "test-offline" => JobType::TestOffline,
//         "test" => JobType::Test,
//         "cvescan" => JobType::CveScan,
//         _ => JobType::Unknown,
//     }
// }
