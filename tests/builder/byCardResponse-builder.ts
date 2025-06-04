import { ByCardsResponse } from '../../src/bindings/ByCardsResponse';
import { JobBuilder } from './job-builder';
import { PipelineJobsResponseBuilder } from './pipelineJobResponse-builder';

// We model the internal object as: { [cardName]: { [pipelineId]: PipelineJobsResponseBuilder } }
export class ByCardsResponseBuilder {
  private _cardsMap: Record<string, Record<string, PipelineJobsResponseBuilder>>;

  constructor() {
    this._cardsMap = {};
  }

  /**
   * Creates or retrieves the card (cardName) and initializes its pipeline map if it doesn't exist.
   */
  private ensureCard(cardName: string): void {
    if (!this._cardsMap[cardName]) {
      this._cardsMap[cardName] = {};
    }
  }

  /**
   * Adds a PipelineJobsResponseBuilder associated with a given pipelineId under a specified card.
   * If you want to override/customize a PipelineJobsResponse before calling build, retrieve the returned builder.
   *
   * Example usage:
   *   const builderP = new PipelineJobsResponseBuilder().withTitle('My Pipeline');
   *   byCardsBuilder.addPipeline('cardA', 'pipeline-123', builderP);
   *
   * @param cardName       Name of the card (external key in ByCardsResponse)
   * @param pipelineId     Identifier of the pipeline (internal key within the card)
   * @param pipelineBuilder  Instance of PipelineJobsResponseBuilder
   */
  addPipeline(
    cardName: string,
    pipelineId: string,
    pipelineBuilder?: PipelineJobsResponseBuilder,
  ): PipelineJobsResponseBuilder {
    this.ensureCard(cardName);
    const builder = pipelineBuilder ?? new PipelineJobsResponseBuilder();
    this._cardsMap[cardName][pipelineId] = builder;
    return builder;
  }

  default(): ByCardsResponse {
    const pipelineAbuilder = new PipelineJobsResponseBuilder()
      .addBuildJob(new JobBuilder())
      .addTestJob(new JobBuilder().withId(1))
      .withId(42);
    this.addPipeline('raspberrypi4-64-welma', '42', new PipelineJobsResponseBuilder());
    this.addPipeline('raspberrypi4-64-welma', '50', new PipelineJobsResponseBuilder());
    this.addPipeline('tungsten-700-smarc-welma', '5', pipelineAbuilder);
    this.addPipeline('maaxboard-8ulp-welma', '5', pipelineAbuilder);
    return this.build();
  }
  /**
   * Retrieves an existing builder for modification, if present.
   *
   * @param cardName
   * @param pipelineId
   */
  getPipelineBuilder(
    cardName: string,
    pipelineId: string,
  ): PipelineJobsResponseBuilder | undefined {
    return this._cardsMap[cardName]?.[pipelineId];
  }

  /**
   * Final method that constructs the complete ByCardsResponse object by
   * iterating over each card and then each pipelineId.
   */
  build(): ByCardsResponse {
    const result: ByCardsResponse = {};
    for (const cardName of Object.keys(this._cardsMap)) {
      const pipelinesForCard = this._cardsMap[cardName];
      const builtMap: Record<string, any> = {};
      for (const pipelineId of Object.keys(pipelinesForCard)) {
        builtMap[pipelineId] = pipelinesForCard[pipelineId].build();
      }
      result[cardName] = builtMap;
    }
    return result;
  }
}
