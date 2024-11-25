import {Box, Colors, Icon, Popover, Tag} from '@dagster-io/ui-components';
import {useMemo} from 'react';

import {PartitionSubsetList} from './PartitionSubsetList';
import {AssetConditionEvaluationRecordFragment} from './types/GetEvaluationsQuery.types';
import {AssetViewDefinitionNodeFragment} from '../types/AssetView.types';

interface Props {
  definition: AssetViewDefinitionNodeFragment;
  selectedEvaluation: AssetConditionEvaluationRecordFragment;
  selectPartition: (partitionKey: string | null) => void;
}

export const EvaluationStatusTag = ({definition, selectedEvaluation, selectPartition}: Props) => {
  const evaluation = selectedEvaluation?.evaluation;
  const rootEvaluationNode = useMemo(
    () => evaluation?.evaluationNodes.find((node) => node.uniqueId === evaluation.rootUniqueId),
    [evaluation],
  );
  const rootUniqueId = evaluation?.rootUniqueId;

  const partitionDefinition = definition?.partitionDefinition;
  const assetKeyPath = definition?.assetKey.path || [];
  const numRequested = selectedEvaluation?.numRequested;

  const numTrue =
    rootEvaluationNode?.__typename === 'PartitionedAssetConditionEvaluationNode'
      ? rootEvaluationNode.numTrue
      : null;

  if (numRequested) {
    if (partitionDefinition && rootUniqueId && numTrue) {
      return (
        <Box flex={{direction: 'row', gap: 4, alignItems: 'center'}}>
          <Popover
            interactionKind="hover"
            placement="bottom"
            hoverOpenDelay={50}
            hoverCloseDelay={50}
            content={
              <PartitionSubsetList
                description="Requested assets"
                assetKeyPath={assetKeyPath}
                evaluationId={selectedEvaluation.evaluationId}
                nodeUniqueId={rootUniqueId}
                selectPartition={selectPartition}
              />
            }
          >
            <Tag intent="success">
              <Box flex={{direction: 'row', gap: 4, alignItems: 'center'}}>
                <Icon name="check_filled" color={Colors.accentGreen()} />
                {numRequested} requested
              </Box>
            </Tag>
          </Popover>
        </Box>
      );
    }

    return (
      <Tag intent="success">
        <Box flex={{direction: 'row', gap: 4, alignItems: 'center'}}>
          <Icon name="check_filled" color={Colors.accentGreen()} />
          Requested
        </Box>
      </Tag>
    );
  }

  return (
    <Tag>
      <Box flex={{direction: 'row', gap: 4, alignItems: 'center'}}>
        <Icon name="check_missing" color={Colors.accentGray()} />
        Not requested
      </Box>
    </Tag>
  );
};