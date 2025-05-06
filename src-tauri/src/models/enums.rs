use std::fmt;

#[derive(Debug)]
pub enum JobType {
    Build,
    Test,
    CveScan,
    TestOffline,
    Unknown,
}

#[derive(Debug)]
pub enum ProjectId {
    Ci,
    Pipeline,
}

impl fmt::Display for ProjectId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            ProjectId::Ci => "45354308",
            ProjectId::Pipeline => "141245",
        };
        f.write_str(s)
    }
}


pub fn get_job_type(type_of_job: &str) -> JobType {
    match type_of_job {
        "build" => JobType::Build,
        "test-offline" => JobType::TestOffline,
        "test" => JobType::Test,
        "cvescan" => JobType::CveScan,
        _ => JobType::Unknown,
    }
}