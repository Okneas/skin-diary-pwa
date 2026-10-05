import apiClient from "./client";
import type {
  AgingType,
  SubjectiveFeature,
  ObjectiveFeature,
  GeneticPredisposition,
  Gene,
  GraphData,
} from "@/types";

export const getAgingTypes = () =>
  apiClient.get<AgingType[]>("/aging-types").then((r) => r.data);

export const getSubjectiveFeatures = () =>
  apiClient.get<SubjectiveFeature[]>("/subjective-features").then((r) => r.data);

export const getObjectiveFeatures = () =>
  apiClient.get<ObjectiveFeature[]>("/objective-features").then((r) => r.data);

export const getGeneticPredispositions = () =>
  apiClient
    .get<GeneticPredisposition[]>("/genetic-predispositions")
    .then((r) => r.data);

export const getGenes = () =>
  apiClient.get<Gene[]>("/genes").then((r) => r.data);

export const getBaseGraphs = () =>
  apiClient.get<GraphData[]>("/graphs/base").then((r) => r.data);