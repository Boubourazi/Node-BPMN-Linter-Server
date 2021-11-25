
export interface ModdleElement {
    //$attrs: Object; // Unused...
    default?: ModdleElement; // Exclusive/inclusive gateway default exit...
    eventDefinitions?: Array<ModdleElement>;
    id: string;
    incoming?: Array<ModdleElement>;
    flowElements?: Array<ModdleElement>;
    name?: string;
    outgoing?: Array<ModdleElement>;
    //parallelMultiple: boolean; // Unused...
    //$parent?: ModdleElement; // Unused...
    sourceRef?: ModdleElement; // 'bpmn:sequenceFlow' only? -> NO!
    targetRef?: ModdleElement; // 'bpmn:sequenceFlow' only? -> NO!
    $type: string;
}

export interface Event_based_gateway extends ModdleElement {
    eventGatewayType: string; // "Exclusive" versus "Parallel"
    instantiate: boolean; // "Parallel" => "true" according to the BPMN spec. ver. 2.0.2?
}

export interface Boundary_event extends ModdleElement {
    attachedToRef: ModdleElement;
    cancelActivity: boolean;
}

