declare const _default: ({
    title: string;
    pipelineUrl: string;
    promptbookVersion: string;
    parameters: {
        name: string;
        description: string;
        isInput: boolean;
        isOutput: boolean;
    }[];
    promptTemplates: {
        blockType: string;
        name: string;
        title: string;
        modelRequirements: {
            modelVariant: string;
        };
        content: string;
        dependentParameterNames: string[];
        resultingParameterName: string;
    }[];
    knowledgeSources: never[];
    knowledgePieces: never[];
    personas: never[];
    preparations: never[];
    sourceFile: string;
} | {
    title: string;
    pipelineUrl: string;
    promptbookVersion: string;
    parameters: {
        name: string;
        description: string;
        isInput: boolean;
        isOutput: boolean;
    }[];
    promptTemplates: {
        blockType: string;
        name: string;
        title: string;
        modelRequirements: {
            modelVariant: string;
        };
        content: string;
        expectations: {
            words: {
                min: number;
                max: number;
            };
        };
        dependentParameterNames: string[];
        resultingParameterName: string;
    }[];
    knowledgeSources: never[];
    knowledgePieces: never[];
    personas: never[];
    preparations: never[];
    sourceFile: string;
} | {
    title: string;
    pipelineUrl: string;
    promptbookVersion: string;
    parameters: {
        name: string;
        description: string;
        isInput: boolean;
        isOutput: boolean;
    }[];
    promptTemplates: {
        blockType: string;
        name: string;
        title: string;
        modelRequirements: {
            modelVariant: string;
        };
        content: string;
        expectFormat: string;
        dependentParameterNames: string[];
        resultingParameterName: string;
    }[];
    knowledgeSources: never[];
    knowledgePieces: never[];
    personas: never[];
    preparations: never[];
    sourceFile: string;
})[];
export default _default;
