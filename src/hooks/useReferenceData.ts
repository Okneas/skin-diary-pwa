import { useQuery } from "@tanstack/react-query";
import {
  getAgingTypes,
  getSubjectiveFeatures,
  getObjectiveFeatures,
  getGeneticPredispositions,
  getGenes,
  getBaseGraphs,
} from "@/api/reference";
import { getFactors } from "@/api/factors";

export const useAgingTypes = () =>
  useQuery({ queryKey: ["agingTypes"], queryFn: getAgingTypes });

export const useSubjectiveFeatures = () =>
  useQuery({ queryKey: ["subjectiveFeatures"], queryFn: getSubjectiveFeatures });

export const useObjectiveFeatures = () =>
  useQuery({ queryKey: ["objectiveFeatures"], queryFn: getObjectiveFeatures });

export const useGeneticPredispositions = () =>
  useQuery({
    queryKey: ["geneticPredispositions"],
    queryFn: getGeneticPredispositions,
  });

export const useGenes = () =>
  useQuery({ queryKey: ["genes"], queryFn: getGenes });

export const useBaseGraphs = () =>
  useQuery({ queryKey: ["baseGraphs"], queryFn: getBaseGraphs });

export const useFactors = () =>
  useQuery({ queryKey: ["factors"], queryFn: getFactors });