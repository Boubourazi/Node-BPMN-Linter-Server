"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Drag_and_drop from "../js/Drag_and_drop.js"; // Execution...
const bpmn_moddle_1 = __importDefault(require("bpmn-moddle"));
//declare const BpmnModdle: any; // 'any' is imposed by '"noImplicitAny": true'
const Get_functions = (object) => {
    let functions = [];
    for (let f in object)
        if (typeof object[f] === "function" /*&& object.hasOwnProperty(f)*/) // Inherited functions (with comment) as well...
            functions.push(f);
    return functions;
};
/**
 * Danger: BPMN-io.js capitalizes letters, e.g., 'bpmn:sequenceFlow' in a source XML file
 * becomes 'bpmn:SequenceFlow' at run-time!
 */
var Activity_type;
(function (Activity_type) {
    Activity_type["BPMN_BusinessRuleTask"] = "bpmn:BusinessRuleTask";
    Activity_type["BPMN_CallActivity"] = "bpmn:CallActivity";
    Activity_type["BPMN_ManualTask"] = "bpmn:ManualTask";
    Activity_type["BPMN_ReceiveTask"] = "bpmn:ReceiveTask";
    Activity_type["BPMN_ScriptTask"] = "bpmn:ScriptTask";
    Activity_type["BPMN_SendTask"] = "bpmn:SendTask";
    Activity_type["BPMN_ServiceTask"] = "bpmn:ServiceTask";
    Activity_type["BPMN_SubProcess"] = "bpmn:SubProcess";
    Activity_type["BPMN_Task"] = "bpmn:Task";
    Activity_type["BPMN_UserTask"] = "bpmn:UserTask";
})(Activity_type || (Activity_type = {}));
var Activity_validation;
(function (Activity_validation) {
    Activity_validation["BPMN_BusinessRuleTask"] = "bpmn:BusinessRuleTask";
    Activity_validation["BPMN_CallActivity"] = "bpmn:CallActivity";
    Activity_validation["BPMN_ManualTask"] = "bpmn:ManualTask";
    Activity_validation["BPMN_ReceiveTask"] = "bpmn:ReceiveTask";
    Activity_validation["BPMN_ScriptTask"] = "bpmn:ScriptTask";
    Activity_validation["BPMN_SendTask"] = "bpmn:SendTask";
    Activity_validation["BPMN_ServiceTask"] = "bpmn:ServiceTask";
    Activity_validation["BPMN_SubProcess"] = "bpmn:SubProcess";
    Activity_validation["BPMN_Task"] = "bpmn:Task";
    Activity_validation["BPMN_UserTask"] = "bpmn:UserTask";
    Activity_validation["Error"] = "xx error";
    Activity_validation["Unknown"] = "Activity type isn't supported or activity configuration is unknown...";
    Activity_validation["Warning1"] = "Activity acts as a start point";
    Activity_validation["Warning2"] = "Activity with suspicious JOIN parallelism";
    Activity_validation["Warning3"] = "Activity acts as an end point";
    Activity_validation["Warning4"] = "Activity with suspicious FORK parallelism";
})(Activity_validation || (Activity_validation = {}));
var Event_type;
(function (Event_type) {
    Event_type["BPMN_BoundaryEvent"] = "bpmn:BoundaryEvent";
    Event_type["BPMN_BoundaryCompensateEvent"] = "bpmn:BoundaryEvent@bpmn:CompensateEventDefinition";
    Event_type["BPMN_BoundaryConditionalEvent"] = "bpmn:BoundaryEvent@bpmn:ConditionalEventDefinition";
    Event_type["BPMN_BoundaryErrorEvent"] = "bpmn:BoundaryEvent@bpmn:ErrorEventDefinition";
    Event_type["BPMN_BoundaryEscalationEvent"] = "bpmn:BoundaryEvent@bpmn:EscalationEventDefinition";
    Event_type["BPMN_BoundaryMessageEvent"] = "bpmn:BoundaryEvent@bpmn:MessageEventDefinition";
    Event_type["BPMN_BoundarySignalEvent"] = "bpmn:BoundaryEvent@bpmn:SignalEventDefinition";
    Event_type["BPMN_BoundaryTimerEvent"] = "bpmn:BoundaryEvent@bpmn:TimerEventDefinition";
    Event_type["BPMN_EndEvent"] = "bpmn:EndEvent";
    Event_type["BPMN_EndCompensateEvent"] = "bpmn:EndEvent@bpmn:CompensateEventDefinition";
    Event_type["BPMN_EndErrorEvent"] = "bpmn:EndEvent@bpmn:ErrorEventDefinition";
    Event_type["BPMN_EndEscalationEvent"] = "bpmn:EndEvent@bpmn:EscalationEventDefinition";
    Event_type["BPMN_EndMessageEvent"] = "bpmn:EndEvent@bpmn:MessageEventDefinition";
    Event_type["BPMN_EndSignalEvent"] = "bpmn:EndEvent@bpmn:SignalEventDefinition";
    Event_type["BPMN_EndTerminateEvent"] = "bpmn:EndEvent@bpmn:TerminateEventDefinition";
    Event_type["BPMN_IntermediateCatchEvent"] = "bpmn:IntermediateCatchEvent";
    Event_type["BPMN_IntermediateCatchConditionalEvent"] = "bpmn:IntermediateCatchEvent@bpmn:ConditionalEventDefinition";
    Event_type["BPMN_IntermediateCatchEscalationEvent"] = "bpmn:IntermediateCatchEvent@bpmn:EscalationEventDefinition";
    // 'incoming' must be empty, similar to "start event":
    Event_type["BPMN_IntermediateCatchLinkEvent"] = "bpmn:IntermediateCatchEvent@bpmn:LinkEventDefinition";
    Event_type["BPMN_IntermediateCatchMessageEvent"] = "bpmn:IntermediateCatchEvent@bpmn:MessageEventDefinition";
    Event_type["BPMN_IntermediateCatchSignalEvent"] = "bpmn:IntermediateCatchEvent@bpmn:SignalEventDefinition";
    Event_type["BPMN_IntermediateCatchTimerEvent"] = "bpmn:IntermediateCatchEvent@bpmn:TimerEventDefinition";
    Event_type["BPMN_IntermediateThrowCompensateEvent"] = "bpmn:IntermediateThrowEvent@bpmn:CompensateEventDefinition";
    Event_type["BPMN_IntermediateThrowEscalationEvent"] = "bpmn:IntermediateThrowEvent@bpmn:EscalationEventDefinition";
    Event_type["BPMN_IntermediateThrowLinkEvent"] = "bpmn:IntermediateThrowEvent@bpmn:LinkEventDefinition";
    Event_type["BPMN_IntermediateThrowMessageEvent"] = "bpmn:IntermediateThrowEvent@bpmn:MessageEventDefinition";
    Event_type["BPMN_IntermediateThrowSignalEvent"] = "bpmn:IntermediateThrowEvent@bpmn:SignalEventDefinition";
    Event_type["BPMN_StartEvent"] = "bpmn:StartEvent";
    Event_type["BPMN_StartEventConditionalEvent"] = "bpmn:StartEvent@bpmn:ConditionalEventDefinition";
    Event_type["BPMN_StartEventMessageEvent"] = "bpmn:StartEvent@bpmn:MessageEventDefinition";
    Event_type["BPMN_StartEventSignalEvent"] = "bpmn:StartEvent@bpmn:SignalEventDefinition";
    Event_type["BPMN_StartEventTimerEvent"] = "bpmn:StartEvent@bpmn:TimerEventDefinition";
})(Event_type || (Event_type = {}));
var Event_validation;
(function (Event_validation) {
    Event_validation["BPMN_BoundaryEvent"] = "bpmn:BoundaryEvent";
    Event_validation["BPMN_EndEvent"] = "bpmn:EndEvent";
    Event_validation["BPMN_IntermediateCatchEvent"] = "bpmn:IntermediateCatchEvent";
    Event_validation["BPMN_StartEvent"] = "bpmn:StartEvent";
    Event_validation["Error1"] = "End event with 'outgoing' sequence flow(s)";
    Event_validation["Error2"] = "Start event with 'incoming' sequence flow(s)";
    Event_validation["Unknown"] = "Event type isn't supported or event configuration is unknown...";
    Event_validation["Warning1"] = "End event with suspicious JOIN parallelism";
    Event_validation["Warning2"] = "Intermediate catch event with suspicious FORK parallelism";
    Event_validation["Warning3"] = "Intermediate catch event with suspicious JOIN parallelism";
    Event_validation["Warning4"] = "Start event with suspicious FORK parallelism";
})(Event_validation || (Event_validation = {}));
var Flow_type;
(function (Flow_type) {
    Flow_type["BPMN_ControlFlow"] = "bpmn:ControlFlow";
    Flow_type["BPMN_SequenceFlow"] = "bpmn:SequenceFlow";
})(Flow_type || (Flow_type = {}));
var Gateway_type;
(function (Gateway_type) {
    Gateway_type["BPMN_ComplexGateway"] = "bpmn:ComplexGateway";
    Gateway_type["BPMN_EventBasedGateway"] = "bpmn:EventBasedGateway";
    Gateway_type["BPMN_ExclusiveEventBasedGateway"] = "bpmn:EventBasedGateway@Exclusive";
    Gateway_type["BPMN_ParallelEventBasedGateway"] = "bpmn:EventBasedGateway@Parallel";
    Gateway_type["BPMN_ExclusiveGateway"] = "bpmn:ExclusiveGateway";
    Gateway_type["BPMN_InclusiveGateway"] = "bpmn:InclusiveGateway";
    Gateway_type["BPMN_ParallelGateway"] = "bpmn:ParallelGateway";
})(Gateway_type || (Gateway_type = {}));
var Gateway_validation;
(function (Gateway_validation) {
    Gateway_validation["BPMN_ComplexGateway"] = "bpmn:ComplexGateway";
    Gateway_validation["BPMN_EventBasedGateway"] = "bpmn:EventBasedGateway";
    Gateway_validation["Fork"] = "Fork";
    Gateway_validation["Join"] = "Join";
    Gateway_validation["Unknown"] = "Gateway type isn't supported or gateway configuration is unknown";
    Gateway_validation["Warning_1"] = "Event-based gateway should have more than one outgoing sequence flow";
    Gateway_validation["Warning_2"] = "Event-based gateway outgoing flow objects are 'Conditional', 'ReceiveMessage', 'Signal', 'Timer' events or 'ReceiveMessage' activity";
    Gateway_validation["Warning_3"] = "Neither *fork* nor *join* for exclusive/inclusive/parallel gateway";
})(Gateway_validation || (Gateway_validation = {}));
var Process_type;
(function (Process_type) {
    Process_type["BPMN_Process"] = "bpmn:Process";
})(Process_type || (Process_type = {}));
class BPMN_checker {
    _BPMN_file_URL;
    static _Separator = '@';
    /**
     * bpmn.io-js
     */
    /* Methods: fromXML - toXML - create - getType - createAny - getPackage - getPackages - getElementDescriptor - hasType - getPropertyDescriptor - getTypeDescriptor */
    _moddle = new bpmn_moddle_1.default();
    _viewer = new BpmnJS({
        container: window.document.getElementById("diagram") // See 'diagram' as id. in HTML...
    });
    _canvas = this._viewer.get('canvas');
    _overlays = this._viewer.get('overlays');
    _process;
    /**
     * End of bpmn.io-js
     */
    static _Get_ids = (me, type = Event_type.BPMN_StartEvent) => {
        return me.flowElements.filter((fe) => fe.$type === type).map((fe) => fe.id);
    };
    static _Get_SVGGElement(id) {
        // https://developer.mozilla.org/en-US/docs/Web/API/SVGGElement
        return window.document.querySelector('#diagram [data-element-id=' + id + ']'); // See 'diagram' as id. in HTML...
    }
    constructor(_BPMN_file_URL = './diagrams/Inclusive_gateway.bpmn') {
        this._BPMN_file_URL = _BPMN_file_URL;
        fetch(_BPMN_file_URL).then((response) => this._viewer.importXML(response));
        // Pre-condition (DOM is loaded):
        //console.assert(window.document.readyState !== "loading");
        // Subscribe to drag & drop (import '.js' file is required at execution time):
        //         Drag_and_drop(window.document.getElementById("diagram")).then((XML: string) => {
        //             this._viewer.importXML(XML);
        //         });
        /*window.fetch(_BPMN_file_URL).then((response: Response) => {
            response.text().then(async (XML: string) => {
                try {
                    await this._viewer.importXML(XML);
                    / zoom to fit full viewport
                    const {
                        rootElement: definitions
                    } = await this._moddle.fromXML(XML);
                    this._process = definitions.rootElements[0];
                    
                    console.assert(this._process.$type === Process_type.BPMN_Process);
// Association d'une classe de style (voir './css/BPMN_checker.css') aux événements de début et fin :
                    BPMN_checker._Get_ids(this._process, Event_type.BPMN_StartEvent).forEach((id: string) => {
                        this._canvas.addMarker(id, 'Active');
                        this._overlays.add(id, 'note', {
                            position: {
                                bottom: 0,
                                right: 0
                            },
                            html: '<div class="diagram-note">It starts...</div>'
                        });
                    });

                    BPMN_checker._Get_ids(this._process, Event_type.BPMN_EndEvent).forEach((id: string) => this._canvas.addMarker(id, 'EndEvent'));
                    // 'mouseover'/'mouseleave' handlers for sequence flow as "clickable" BPMN element, i.e., transition in state machine:
                    BPMN_checker._Get_ids(this._process, Flow_type.BPMN_SequenceFlow).forEach((sequence_flow_id: string) => {
                        const sequence_flow_view: SVGGElement = BPMN_checker._Get_SVGGElement(sequence_flow_id);
                        sequence_flow_view.addEventListener('mouseover', (pe: PointerEvent) => {
                            sequence_flow_view.style.stroke = "#FF0000";
                        });
                        sequence_flow_view.addEventListener('mouseleave', (pe: PointerEvent) => {
                            sequence_flow_view.style.stroke = "none";
                        });
                    });

                    
                    this._process.flowElements.forEach((me: ModdleElement) => {
                        // On regarde les éléments de façon itérative pour éviter le récursif ci-dessous
                        //A voir ?

                        // Check 'me'...
                    });

                    // Le contrôle part en récursif à partir des "start event" mais on ne passe pas en revue
                    // des éléments BPMN qui seraient isolés.
                    // Pire, les éléments BPMN sont contrôlés plusieurs fois (à améliorer) !
                    this._validate_process();
                    // Exemple d'extraction d'éléments BPMN appartenant à un type donné :
                    const exclusive_gateways: Array<ModdleElement> = this._process.flowElements.filter((flow_element: ModdleElement) => flow_element.$type === Gateway_type.BPMN_ExclusiveGateway);
                } catch (err) {
                    window.console.error('Could not import BPMN 2.0 diagram... ', err);
                }
            });
        });*/
    }
    /**
     * Activities
     */
    static _Validate_activity = (activity) => {
        if (!Object.values(Activity_type).includes(activity.$type)) // 'values' => ES2017!
            return Activity_validation.Unknown;
        switch (activity.$type) {
            case Activity_type.BPMN_BusinessRuleTask:
            case Activity_type.BPMN_CallActivity:
            case Activity_type.BPMN_ManualTask:
            case Activity_type.BPMN_ReceiveTask:
            case Activity_type.BPMN_ScriptTask:
            case Activity_type.BPMN_SendTask:
            case Activity_type.BPMN_ServiceTask:
            case Activity_type.BPMN_SubProcess:
            case Activity_type.BPMN_Task:
            case Activity_type.BPMN_UserTask:
                if (activity.hasOwnProperty('incoming') && activity.incoming.length === 0)
                    return Activity_validation.Warning1;
                if (activity.hasOwnProperty('incoming') && activity.incoming.length > 1)
                    return Activity_validation.Warning2;
                if (activity.hasOwnProperty('outgoing') && activity.outgoing.length === 0)
                    return Activity_validation.Warning3;
                if (activity.hasOwnProperty('outgoing') && activity.outgoing.length > 1)
                    return Activity_validation.Warning4;
                return activity.$type;
                break;
            default:
                return Activity_validation.Unknown;
        }
    };
    /** Events */
    static _Compute_event_type(event) {
        console.assert(event.$type.includes("Event"));
        if ('eventDefinitions' in event) {
            // Case when 'event.eventDefinitions.length > 1'?
            console.assert(event.eventDefinitions.length === 1);
            return (event.$type + BPMN_checker._Separator + event.eventDefinitions[0].$type);
        }
        return event.$type;
    }
    static _Validate_event = (event) => {
        if (!Object.values(Event_type).includes(event.$type)) // 'values' => ES2017!
            return Event_validation.Unknown;
        if (event.$type === Event_type.BPMN_EndEvent) {
            if (event.hasOwnProperty('outgoing'))
                return Event_validation.Error1;
            if (event.hasOwnProperty('incoming') && event.incoming.length !== 1)
                return Event_validation.Warning1;
            return Event_validation.BPMN_EndEvent;
        }
        else if (event.$type === Event_type.BPMN_IntermediateCatchEvent) {
            if (event.hasOwnProperty('incoming') && event.incoming.length !== 1)
                return Event_validation.Warning2;
            if (event.hasOwnProperty('outgoing') && event.outgoing.length !== 1)
                return Event_validation.Warning3;
            return Event_validation.BPMN_IntermediateCatchEvent;
        }
        else if (event.$type === Event_type.BPMN_StartEvent) {
            if (event.hasOwnProperty('incoming'))
                return Event_validation.Error2;
            if (event.hasOwnProperty('outgoing') && event.outgoing.length !== 1)
                return Event_validation.Warning4;
            return Event_validation.BPMN_StartEvent;
        }
        return Event_validation.Unknown;
    };
    _validate_start_event = (start_event) => {
        console.assert(start_event.$type === Event_type.BPMN_StartEvent);
        const validation = BPMN_checker._Validate_event(start_event);
        if (validation === Event_validation.BPMN_StartEvent /*|| WARNING*/) {
            start_event.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === start_event.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    };
    _validate_end_event = (end_event) => {
        console.assert(end_event.$type === Event_type.BPMN_EndEvent);
        const validation = BPMN_checker._Validate_event(end_event);
        /* Missing code */
        return validation;
    };
    /** End of events */
    _validate_activity = (activity) => {
        const validation = BPMN_checker._Validate_activity(activity);
        if (validation === Activity_validation.BPMN_BusinessRuleTask || validation === Activity_validation.BPMN_CallActivity
            || validation === Activity_validation.BPMN_ManualTask || validation === Activity_validation.BPMN_ReceiveTask
            || validation === Activity_validation.BPMN_ScriptTask || validation === Activity_validation.BPMN_SendTask
            || validation === Activity_validation.BPMN_ServiceTask || validation === Activity_validation.BPMN_SubProcess
            || validation === Activity_validation.BPMN_Task || validation === Activity_validation.BPMN_UserTask /*|| WARNING*/) {
            activity.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === activity.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    };
    /** End of activitys */
    /**
     * Gateways
     */
    static _Compute_gateway_type(event_based_gateway) {
        console.assert(event_based_gateway.$type.includes("EventBasedGateway"));
        return (event_based_gateway.$type + BPMN_checker._Separator + event_based_gateway.eventGatewayType);
    }
    static _Validate_gateway = (gateway) => {
        if (!Object.values(Gateway_type).includes(gateway.$type)) { // 'values' => ES2017!
            return Gateway_validation.Unknown;
        }
        /**
         * **PAS BESOIN** de tester :
         * - Une porte exclusive a 0 ou 1 flux de séquence sortie "default"
         * - Une porte inclusive a 0 ou 1 flux de séquence sortie "default"
         * - Une porte parallèle a 0 flux de séquence sortie "default"
         * - Une porte événement exclusive a 0 flux de séquence sortie "default"
         * - Une porte événement parallèle a 0 flux de séquence sortie "default"
         */
        if (gateway.$type === Gateway_type.BPMN_EventBasedGateway) {
            /**
             * To be done: distinguish between exclusive and parallel event-based gateways
             */
            if ('outgoing' in gateway && gateway.outgoing.length > 1) {
                // 'outgoing' ne sont que des événements reçus parmi "Condition", ReceiveMessage, Signal, Timer ou tâche de réception de message...
                gateway.outgoing.map(sequence_flow => sequence_flow.targetRef)
                    // Useless a priori:
                    .filter(flow_object => flow_object !== undefined);
            }
            else
                return Gateway_validation.Warning_1;
            return Gateway_validation.BPMN_EventBasedGateway;
        }
        else {
            /**
             * Note: complex gateways are processed as inclusive gateways
             */
            console.assert(gateway.$type === Gateway_type.BPMN_ComplexGateway || gateway.$type === Gateway_type.BPMN_ExclusiveGateway
                || gateway.$type === Gateway_type.BPMN_InclusiveGateway || gateway.$type === Gateway_type.BPMN_ParallelGateway);
            if (gateway.hasOwnProperty('incoming') &&
                gateway.incoming.length === 1 &&
                gateway.hasOwnProperty('outgoing') &&
                gateway.outgoing.length > 1)
                return Gateway_validation.Fork;
            else if (gateway.hasOwnProperty('incoming') &&
                gateway.incoming.length > 1 &&
                gateway.hasOwnProperty('outgoing') &&
                gateway.outgoing.length === 1)
                return Gateway_validation.Join;
            else
                return Gateway_validation.Warning_3;
        }
        return Gateway_validation.Unknown;
    };
    _validate_exclusive_gateway = (exclusive_gateway) => {
        console.assert(exclusive_gateway.$type === Gateway_type.BPMN_ExclusiveGateway);
        const validation = BPMN_checker._Validate_gateway(exclusive_gateway);
        if (validation === Gateway_validation.Fork) {
            exclusive_gateway.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === exclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        else if (validation === Gateway_validation.Join) {
            // Si on fait en récursif, ne pas contrôler plusieurs fois... A CHANGER (débile) :
            const DIAGNOSTIC_DEJA_FAIT = false;
            if (DIAGNOSTIC_DEJA_FAIT)
                return validation;
            exclusive_gateway.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === exclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    };
    _validate_inclusive_gateway = (inclusive_gateway) => {
        console.assert(inclusive_gateway.$type === Gateway_type.BPMN_InclusiveGateway);
        const validation = BPMN_checker._Validate_gateway(inclusive_gateway);
        if (validation === Gateway_validation.Fork) {
            inclusive_gateway.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === inclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        else if (validation === Gateway_validation.Join) {
            // Si on fait en récursif, ne pas contrôler plusieurs fois... A CHANGER (débile) :
            const DIAGNOSTIC_DEJA_FAIT = false;
            if (DIAGNOSTIC_DEJA_FAIT)
                return validation;
            inclusive_gateway.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === inclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    };
    _validate_parallel_gateway = (parallel_gateway) => {
        console.assert(parallel_gateway.$type === Gateway_type.BPMN_ParallelGateway);
        const validation = BPMN_checker._Validate_gateway(parallel_gateway);
        if (validation === Gateway_validation.Fork) {
            parallel_gateway.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === parallel_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        else if (validation === Gateway_validation.Join) {
            // Si on fait en récursif, ne pas contrôler plusieurs fois... A CHANGER (débile) :
            const DIAGNOSTIC_DEJA_FAIT = false;
            if (DIAGNOSTIC_DEJA_FAIT)
                return validation;
            parallel_gateway.outgoing.forEach((sequence_flow) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === parallel_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    };
    _validate_BPMN_object = (me) => {
        switch (me.$type) {
            case Event_type.BPMN_EndEvent:
            case Event_type.BPMN_EndErrorEvent:
                this._validate_end_event(me);
                break;
            case Event_type.BPMN_IntermediateCatchEvent:
                // Missing code
                break;
            case Event_type.BPMN_StartEvent:
            case Event_type.BPMN_StartEventConditionalEvent:
            case Event_type.BPMN_StartEventMessageEvent:
            case Event_type.BPMN_StartEventSignalEvent:
            case Event_type.BPMN_StartEventTimerEvent:
                this._validate_start_event(me);
                break;
            case Gateway_type.BPMN_EventBasedGateway: // "Exclusive" versus "Parallel"?
                // Missing code
                break;
            case Gateway_type.BPMN_ExclusiveGateway:
                this._validate_exclusive_gateway(me);
                break;
            // Complex gateways behave somehow like inclusive gateways (OMG BPMN spec., ver. 2.0.2, p. 294):
            case Gateway_type.BPMN_ComplexGateway:
            case Gateway_type.BPMN_InclusiveGateway:
                this._validate_inclusive_gateway(me);
                break;
            case Gateway_type.BPMN_ParallelGateway:
                this._validate_parallel_gateway(me);
                break;
            case Activity_type.BPMN_BusinessRuleTask:
            case Activity_type.BPMN_CallActivity:
            case Activity_type.BPMN_ManualTask:
            case Activity_type.BPMN_ReceiveTask:
            case Activity_type.BPMN_ScriptTask:
            case Activity_type.BPMN_SendTask:
            case Activity_type.BPMN_ServiceTask:
            case Activity_type.BPMN_SubProcess:
            case Activity_type.BPMN_Task:
            case Activity_type.BPMN_UserTask:
                const validation = BPMN_checker._Validate_activity(me);
                if (validation === Activity_validation.BPMN_BusinessRuleTask || validation === Activity_validation.BPMN_CallActivity
                    || validation === Activity_validation.BPMN_ManualTask || validation === Activity_validation.BPMN_ReceiveTask
                    || validation === Activity_validation.BPMN_ScriptTask || validation === Activity_validation.BPMN_SendTask
                    || validation === Activity_validation.BPMN_ServiceTask || validation === Activity_validation.BPMN_SubProcess
                    || validation === Activity_validation.BPMN_Task || validation === Activity_validation.BPMN_UserTask) {
                    // C'est bon, y'a ni error ni warning...
                }
                else {
                    this._canvas.addMarker(me.id, 'Warning'); // Ou 'error' etc.
                    // API Overlays:
                    //window.alert(Get_functions(this._overlays).join(" - "));
                    // https://github.com/bpmn-io/bpmn-js-examples/tree/master/overlays
                    this._overlays.add(me.id /*, 'note'*/, {
                        position: {
                            bottom: 0,
                            right: 0
                        },
                        html: '<div class="Validation">' + validation + '</div>'
                    });
                    // Suppr : this._overlays.remove({ element: me.id });
                    // Eventuellement cette API pour ajouter des commentaires aux warnings et errors ?
                    // https://github.com/bpmn-io/bpmn-js-examples/tree/master/commenting
                }
                break;
            default:
                throw new Error('BPMN element type is not supported...');
        }
    };
    _validate_process = () => {
        const start_events = this._process.flowElements.filter((flow_element) => flow_element.$type === Event_type.BPMN_StartEvent);
        if (start_events.length === 0)
            throw new Error('No start event at all...');
        // Recursion starts from here:
        start_events.forEach(start_event => this._validate_BPMN_object(start_event));
    };
}
exports.default = BPMN_checker;
/*window.addEventListener("contextmenu", (event: MouseEvent) => {
    alert("oncontextmenu");
    event.preventDefault();
});

window.addEventListener("DOMContentLoaded", () => {
    new BPMN_checker('./diagrams/diagram.bpmn');
});*/
//# sourceMappingURL=BPMN_checker.js.map