use crate::models::api_struct::{Job, Pipeline};
use crate::models::enums::JobType;
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};

// !todo use an hashmap with enum cardType, to get more flexibility if type of card need to be add.
// Need to manually modify if new type of card added
#[derive(Debug, Deserialize, Serialize, Default)]
pub struct ByCardsResponse {
    #[serde(rename = "de-next-rap8-x86")]
    de_next_rap8_x86: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "hbjc386f951t-x86")]
    hbjc386f951t_x86: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "imx8mm-cgt-sx8m-rev-a")]
    imx8mm_cgt_sx8m_rev_a: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "k393x-mini-x86")]
    k393x_mini_x86: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "maaxboard-8ulp-welma")]
    maaxboard_8ulp_welma: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "qemuarm-welma")]
    qemuarm_welma: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "raspberrypi4-64-welma")]
    raspberrypi4_64_welma: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "sm2s-imx8plus-mbep5")]
    sm2s_imx8plus_mbep5: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "stm32mp15-disco-welma")]
    stm32mp15_disco_welma: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "tungsten-700-smarc-welma")]
    tungsten_700_smarc_welma: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "sm2s-imx93-mbep5")]
    sm2s_imx93_mbep5: HashMap<u64, PipelineJobsResponse>,
    #[serde(rename = "raspberrypi4-64")]
    raspberrypi4_64: HashMap<u64, PipelineJobsResponse>,
    unknown: HashMap<u64, PipelineJobsResponse>,
    unknown_card_name: HashSet<String>,
}

impl ByCardsResponse {
    pub fn insert_job(
        &mut self,
        card_type: &str,
        job_type: JobType,
        pipeline: &Pipeline,
        job: Job,
    ) {
        // Need to manually modify if new type of card added
        let card_hash_map = match card_type {
            "de-next-rap8-x86" => &mut self.de_next_rap8_x86,
            "hbjc386f951t-x86" => &mut self.hbjc386f951t_x86,
            "imx8mm-cgt-sx8m-rev-a" => &mut self.imx8mm_cgt_sx8m_rev_a,
            "k393x-mini-x86" => &mut self.k393x_mini_x86,
            "maaxboard-8ulp-welma" => &mut self.maaxboard_8ulp_welma,
            "qemuarm-welma" => &mut self.qemuarm_welma,
            "raspberrypi4-64-welma" => &mut self.raspberrypi4_64_welma,
            "stm32mp15-disco-welma" => &mut self.stm32mp15_disco_welma,
            "tungsten-700-smarc-welma" => &mut self.tungsten_700_smarc_welma,
            "sm2s-imx93-mbep5" => &mut self.sm2s_imx93_mbep5,
            "sm2s-imx8plus-mbep5" => &mut self.sm2s_imx8plus_mbep5,
            "raspberrypi4-64" => &mut self.raspberrypi4_64,
            other => {
                self.unknown_card_name.insert(other.to_string());
                &mut self.unknown
            }
        };

        /*Create the pipelineStruct if the key is not present, that's why i have to pass the reference
        to the pipeline struct at everycall*/
        let pipeline = card_hash_map.entry(pipeline.id).or_insert_with(|| {
            PipelineJobsResponse::new(
                pipeline.id,
                pipeline.status.clone(),
                pipeline.project_id,
                pipeline.created_at.clone(),
                pipeline.updated_at.clone(),
            )
        });

        pipeline.push_job(job_type, job);
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
struct PipelineJobsResponse {
    id: u64,
    status: String,
    project_id: u64,
    created_at: String,
    updated_at: String,
    build: Vec<Job>,
    cve: Vec<Job>,
    test: Vec<Job>,
    test_offline: Vec<Job>,
    unknown: Vec<Job>,
}

impl PipelineJobsResponse {
    pub fn new(
        id: u64,
        status: String,
        project_id: u64,
        created_at: String,
        updated_at: String,
    ) -> Self {
        PipelineJobsResponse {
            id,
            status,
            project_id,
            created_at,
            updated_at,
            build: Vec::new(),
            cve: Vec::new(),
            test: Vec::new(),
            test_offline: Vec::new(),
            unknown: Vec::new(),
        }
    }
    pub fn push_job(&mut self, job_type: JobType, job: Job) {
        match job_type {
            JobType::Build => self.build.push(job),
            JobType::CveScan => self.cve.push(job),
            JobType::Test => self.test.push(job),
            JobType::TestOffline => self.test_offline.push(job),
            JobType::Unknown => self.unknown.push(job),
        }
    }
}
