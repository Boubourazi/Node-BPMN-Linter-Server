import {ModdleElement, Event_based_gateway, Boundary_event} from "./BPMN-JS"; // Compilation...
// import Drag_and_drop from "../js/Drag_and_drop.js"; // Execution...
import BpmnModdle from 'bpmn-moddle';
import { response } from "express";

declare const BpmnJS: any; // 'any' is imposed by '"noImplicitAny": true'
//declare const BpmnModdle: any; // 'any' is imposed by '"noImplicitAny": true'

const Get_functions = (object: any) => {
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
enum Activity_type {
    BPMN_BusinessRuleTask = "bpmn:BusinessRuleTask",
    BPMN_CallActivity = "bpmn:CallActivity",
    BPMN_ManualTask = "bpmn:ManualTask",
    BPMN_ReceiveTask = "bpmn:ReceiveTask",
    BPMN_ScriptTask = "bpmn:ScriptTask",
    BPMN_SendTask = "bpmn:SendTask",
    BPMN_ServiceTask = "bpmn:ServiceTask",
    BPMN_SubProcess = "bpmn:SubProcess",
    BPMN_Task = "bpmn:Task", // Abstract task...
    BPMN_UserTask = "bpmn:UserTask"
}

enum Activity_validation {
    BPMN_BusinessRuleTask = "bpmn:BusinessRuleTask",
    BPMN_CallActivity = "bpmn:CallActivity",
    BPMN_ManualTask = "bpmn:ManualTask",
    BPMN_ReceiveTask = "bpmn:ReceiveTask",
    BPMN_ScriptTask = "bpmn:ScriptTask",
    BPMN_SendTask = "bpmn:SendTask",
    BPMN_ServiceTask = "bpmn:ServiceTask",
    BPMN_SubProcess = "bpmn:SubProcess",
    BPMN_Task = "bpmn:Task", // Abstract task...
    BPMN_UserTask = "bpmn:UserTask",
    Error = "xx error",
    Unknown = "Activity type isn't supported or activity configuration is unknown...",
    Warning1 = "Activity acts as a start point",
    Warning2 = "Activity with suspicious JOIN parallelism",
    Warning3 = "Activity acts as an end point",
    Warning4 = "Activity with suspicious FORK parallelism"
}

enum Event_type {
    BPMN_BoundaryEvent = "bpmn:BoundaryEvent",
    BPMN_BoundaryCompensateEvent = "bpmn:BoundaryEvent@bpmn:CompensateEventDefinition", // By default, non-interrupting...
    BPMN_BoundaryConditionalEvent = "bpmn:BoundaryEvent@bpmn:ConditionalEventDefinition",
    BPMN_BoundaryErrorEvent = "bpmn:BoundaryEvent@bpmn:ErrorEventDefinition",
    BPMN_BoundaryEscalationEvent = "bpmn:BoundaryEvent@bpmn:EscalationEventDefinition",
    BPMN_BoundaryMessageEvent = "bpmn:BoundaryEvent@bpmn:MessageEventDefinition",
    BPMN_BoundarySignalEvent = "bpmn:BoundaryEvent@bpmn:SignalEventDefinition",
    BPMN_BoundaryTimerEvent = "bpmn:BoundaryEvent@bpmn:TimerEventDefinition",
    BPMN_EndEvent = "bpmn:EndEvent",
    BPMN_EndCompensateEvent = "bpmn:EndEvent@bpmn:CompensateEventDefinition", // By default, non-interrupting...
    BPMN_EndErrorEvent = "bpmn:EndEvent@bpmn:ErrorEventDefinition",
    BPMN_EndEscalationEvent = "bpmn:EndEvent@bpmn:EscalationEventDefinition",
    BPMN_EndMessageEvent = "bpmn:EndEvent@bpmn:MessageEventDefinition",
    BPMN_EndSignalEvent = "bpmn:EndEvent@bpmn:SignalEventDefinition",
    BPMN_EndTerminateEvent = "bpmn:EndEvent@bpmn:TerminateEventDefinition",
    BPMN_IntermediateCatchEvent = "bpmn:IntermediateCatchEvent",
    BPMN_IntermediateCatchConditionalEvent = "bpmn:IntermediateCatchEvent@bpmn:ConditionalEventDefinition",
    BPMN_IntermediateCatchEscalationEvent = "bpmn:IntermediateCatchEvent@bpmn:EscalationEventDefinition",
    // 'incoming' must be empty, similar to "start event":
    BPMN_IntermediateCatchLinkEvent = "bpmn:IntermediateCatchEvent@bpmn:LinkEventDefinition",
    BPMN_IntermediateCatchMessageEvent = "bpmn:IntermediateCatchEvent@bpmn:MessageEventDefinition",
    BPMN_IntermediateCatchSignalEvent = "bpmn:IntermediateCatchEvent@bpmn:SignalEventDefinition",
    BPMN_IntermediateCatchTimerEvent = "bpmn:IntermediateCatchEvent@bpmn:TimerEventDefinition",
    BPMN_IntermediateThrowCompensateEvent = "bpmn:IntermediateThrowEvent@bpmn:CompensateEventDefinition",
    BPMN_IntermediateThrowEscalationEvent = "bpmn:IntermediateThrowEvent@bpmn:EscalationEventDefinition",
    BPMN_IntermediateThrowLinkEvent = "bpmn:IntermediateThrowEvent@bpmn:LinkEventDefinition",
    BPMN_IntermediateThrowMessageEvent = "bpmn:IntermediateThrowEvent@bpmn:MessageEventDefinition",
    BPMN_IntermediateThrowSignalEvent = "bpmn:IntermediateThrowEvent@bpmn:SignalEventDefinition",
    BPMN_StartEvent = "bpmn:StartEvent",
    BPMN_StartEventConditionalEvent = "bpmn:StartEvent@bpmn:ConditionalEventDefinition",
    BPMN_StartEventMessageEvent = "bpmn:StartEvent@bpmn:MessageEventDefinition",
    BPMN_StartEventSignalEvent = "bpmn:StartEvent@bpmn:SignalEventDefinition",
    BPMN_StartEventTimerEvent = "bpmn:StartEvent@bpmn:TimerEventDefinition"
}

enum Event_validation {
    BPMN_BoundaryEvent = "bpmn:BoundaryEvent",
    BPMN_EndEvent = "bpmn:EndEvent",
    BPMN_IntermediateCatchEvent = "bpmn:IntermediateCatchEvent",
    BPMN_StartEvent = "bpmn:StartEvent",
    Error1 = "End event with 'outgoing' sequence flow(s)",
    Error2 = "Start event with 'incoming' sequence flow(s)",
    Unknown = "Event type isn't supported or event configuration is unknown...",
    Warning1 = "End event with suspicious JOIN parallelism",
    Warning2 = "Intermediate catch event with suspicious FORK parallelism",
    Warning3 = "Intermediate catch event with suspicious JOIN parallelism",
    Warning4 = "Start event with suspicious FORK parallelism"
}

enum Flow_type {
    BPMN_ControlFlow = "bpmn:ControlFlow",
    BPMN_SequenceFlow = "bpmn:SequenceFlow"
}

enum Gateway_type {
    BPMN_ComplexGateway = "bpmn:ComplexGateway",
    BPMN_EventBasedGateway = "bpmn:EventBasedGateway",
    BPMN_ExclusiveEventBasedGateway = "bpmn:EventBasedGateway@Exclusive",
    BPMN_ParallelEventBasedGateway = "bpmn:EventBasedGateway@Parallel",
    BPMN_ExclusiveGateway = "bpmn:ExclusiveGateway",
    BPMN_InclusiveGateway = "bpmn:InclusiveGateway",
    BPMN_ParallelGateway = "bpmn:ParallelGateway"
}

enum Gateway_validation {
    BPMN_ComplexGateway = "bpmn:ComplexGateway",
    BPMN_EventBasedGateway = "bpmn:EventBasedGateway",
    Fork = "Fork", // OK
    Join = "Join", // OK
    Unknown = "Gateway type isn't supported or gateway configuration is unknown",
    Warning_1 = "Event-based gateway should have more than one outgoing sequence flow",
    Warning_2 = "Event-based gateway outgoing flow objects are 'Conditional', 'ReceiveMessage', 'Signal', 'Timer' events or 'ReceiveMessage' activity",
    Warning_3 = "Neither *fork* nor *join* for exclusive/inclusive/parallel gateway"
}

enum Process_type {
    BPMN_Process = "bpmn:Process"
}

class BPMN_checker {
    private static _Separator: string = '@';
    /**
     * bpmn.io-js
     */
    /* Methods: fromXML - toXML - create - getType - createAny - getPackage - getPackages - getElementDescriptor - hasType - getPropertyDescriptor - getTypeDescriptor */
    private _moddle = new BpmnModdle();
    private _viewer = new BpmnJS({
        container: window.document.getElementById("diagram") // See 'diagram' as id. in HTML...
    });
    private _canvas = this._viewer.get('canvas');
    private _overlays = this._viewer.get('overlays');
    private _process: ModdleElement;
    /**
     * End of bpmn.io-js
     */

    private static _Get_ids = (me: ModdleElement, type: string = Event_type.BPMN_StartEvent): Array<string> => {
        return me.flowElements.filter((fe: ModdleElement) => fe.$type === type).map((fe: ModdleElement) => fe.id);
    };

    private static _Get_SVGGElement(id: string): SVGGElement {
        // https://developer.mozilla.org/en-US/docs/Web/API/SVGGElement
        return window.document.querySelector('#diagram [data-element-id=' + id + ']'); // See 'diagram' as id. in HTML...
    }

    constructor(private readonly _BPMN_file_URL: string = './diagrams/Inclusive_gateway.bpmn'){
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
    private static _Validate_activity = (activity: ModdleElement): Activity_validation => {
        if (!Object.values(Activity_type).includes(activity.$type as Activity_type)) // 'values' => ES2017!
            return Activity_validation.Unknown;
        switch (activity.$type as Activity_type) {
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
                return activity.$type as Activity_validation;
                break;
            default:
                return Activity_validation.Unknown;
        }
    }

    /** Events */
    private static _Compute_event_type(event: ModdleElement): Event_type {
        console.assert(event.$type.includes("Event"));
        if ('eventDefinitions' in event) {
            // Case when 'event.eventDefinitions.length > 1'?
            console.assert(event.eventDefinitions.length === 1);
            return <Event_type>(event.$type + BPMN_checker._Separator + event.eventDefinitions[0].$type);
        }
        return <Event_type>event.$type;
    }

    private static _Validate_event = (event: ModdleElement): Event_validation => {
        if (!Object.values(Event_type).includes(event.$type as Event_type)) // 'values' => ES2017!
            return Event_validation.Unknown;
        if (event.$type === Event_type.BPMN_EndEvent) {
            if (event.hasOwnProperty('outgoing'))
                return Event_validation.Error1;
            if (event.hasOwnProperty('incoming') && event.incoming.length !== 1)
                return Event_validation.Warning1;
            return Event_validation.BPMN_EndEvent;
        } else if (event.$type === Event_type.BPMN_IntermediateCatchEvent) {
            if (event.hasOwnProperty('incoming') && event.incoming.length !== 1)
                return Event_validation.Warning2;
            if (event.hasOwnProperty('outgoing') && event.outgoing.length !== 1)
                return Event_validation.Warning3;
            return Event_validation.BPMN_IntermediateCatchEvent
        } else if (event.$type === Event_type.BPMN_StartEvent) {
            if (event.hasOwnProperty('incoming'))
                return Event_validation.Error2;
            if (event.hasOwnProperty('outgoing') && event.outgoing.length !== 1)
                return Event_validation.Warning4;
            return Event_validation.BPMN_StartEvent
        }
        return Event_validation.Unknown;
    }

    private _validate_start_event = (start_event: ModdleElement): Event_validation => {
        console.assert(start_event.$type === Event_type.BPMN_StartEvent);
        const validation: Event_validation = BPMN_checker._Validate_event(start_event);
        if (validation === Event_validation.BPMN_StartEvent /*|| WARNING*/) {
            start_event.outgoing.forEach((sequence_flow: ModdleElement) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === start_event.id);
// Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    }
    private _validate_end_event = (end_event: ModdleElement): Event_validation => {
        console.assert(end_event.$type === Event_type.BPMN_EndEvent);
        const validation: Event_validation = BPMN_checker._Validate_event(end_event);
        /* Missing code */
        return validation
    }
    /** End of events */


    private _validate_activity = (activity: ModdleElement): Activity_validation => {
        const validation: Activity_validation = BPMN_checker._Validate_activity(activity);
        if (validation === Activity_validation.BPMN_BusinessRuleTask || validation === Activity_validation.BPMN_CallActivity
            || validation === Activity_validation.BPMN_ManualTask || validation === Activity_validation.BPMN_ReceiveTask
            || validation === Activity_validation.BPMN_ScriptTask || validation === Activity_validation.BPMN_SendTask
            || validation === Activity_validation.BPMN_ServiceTask || validation === Activity_validation.BPMN_SubProcess
            || validation === Activity_validation.BPMN_Task || validation === Activity_validation.BPMN_UserTask /*|| WARNING*/) {
            activity.outgoing.forEach((sequence_flow: ModdleElement) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === activity.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    }

    /** End of activitys */
    /**
     * Gateways
     */
    private static _Compute_gateway_type(event_based_gateway: Event_based_gateway): Gateway_type {
        console.assert(event_based_gateway.$type.includes("EventBasedGateway"));
        return <Gateway_type>(event_based_gateway.$type + BPMN_checker._Separator + event_based_gateway.eventGatewayType);
    }

    private static _Validate_gateway = (gateway: ModdleElement): Gateway_validation => {
        if (!Object.values(Gateway_type).includes(gateway.$type as Gateway_type)) { // 'values' => ES2017!
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
                    .filter(flow_object => flow_object !== undefined)
            } else
                return Gateway_validation.Warning_1;
            return Gateway_validation.BPMN_EventBasedGateway;
        } else {
            /**
             * Note: complex gateways are processed as inclusive gateways
             */
            console.assert(gateway.$type === Gateway_type.BPMN_ComplexGateway || gateway.$type === Gateway_type.BPMN_ExclusiveGateway
                || gateway.$type === Gateway_type.BPMN_InclusiveGateway || gateway.$type === Gateway_type.BPMN_ParallelGateway)
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
    }

    private _validate_exclusive_gateway = (exclusive_gateway: ModdleElement): Gateway_validation => {
        console.assert(exclusive_gateway.$type === Gateway_type.BPMN_ExclusiveGateway);
        const validation: Gateway_validation = BPMN_checker._Validate_gateway(exclusive_gateway);
        if (validation === Gateway_validation.Fork) {
            exclusive_gateway.outgoing.forEach((sequence_flow: ModdleElement) => { // e.g., 'c4', 'c5' (see "Inclusive_gateway_.bpmn")
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === exclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        } else if (validation === Gateway_validation.Join) {
            // Si on fait en récursif, ne pas contrôler plusieurs fois... A CHANGER (débile) :
            const DIAGNOSTIC_DEJA_FAIT = false;
            if (DIAGNOSTIC_DEJA_FAIT)
                return validation;
            exclusive_gateway.outgoing.forEach((sequence_flow: ModdleElement) => { // Une seule sortie a priori...
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === exclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    }

    private _validate_inclusive_gateway = (inclusive_gateway: ModdleElement): Gateway_validation => {
        console.assert(inclusive_gateway.$type === Gateway_type.BPMN_InclusiveGateway);
        const validation: Gateway_validation = BPMN_checker._Validate_gateway(inclusive_gateway);
        if (validation === Gateway_validation.Fork) {
            inclusive_gateway.outgoing.forEach((sequence_flow: ModdleElement) => { // e.g., 'c1', 'c2'
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === inclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        } else if (validation === Gateway_validation.Join) {
            // Si on fait en récursif, ne pas contrôler plusieurs fois... A CHANGER (débile) :
            const DIAGNOSTIC_DEJA_FAIT = false;
            if (DIAGNOSTIC_DEJA_FAIT)
                return validation;
            inclusive_gateway.outgoing.forEach((sequence_flow: ModdleElement) => { // Une seule sortie a priori...
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === inclusive_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    }

    private _validate_parallel_gateway = (parallel_gateway: ModdleElement): Gateway_validation => {
        console.assert(parallel_gateway.$type === Gateway_type.BPMN_ParallelGateway);
        const validation: Gateway_validation = BPMN_checker._Validate_gateway(parallel_gateway);
        if (validation === Gateway_validation.Fork) {
            parallel_gateway.outgoing.forEach((sequence_flow: ModdleElement) => {
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === parallel_gateway.id);
// Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        } else if (validation === Gateway_validation.Join) {
            // Si on fait en récursif, ne pas contrôler plusieurs fois... A CHANGER (débile) :
            const DIAGNOSTIC_DEJA_FAIT = false;
            if (DIAGNOSTIC_DEJA_FAIT)
                return validation;
            parallel_gateway.outgoing.forEach((sequence_flow: ModdleElement) => { // Une seule sortie a priori...
                console.assert(sequence_flow.$type === Flow_type.BPMN_SequenceFlow);
                console.assert(sequence_flow.sourceRef.id === parallel_gateway.id);
                // Recursive call:
                this._validate_BPMN_object(sequence_flow.targetRef);
            });
        }
        return validation;
    }

    private _validate_BPMN_object = (me: ModdleElement): never | void => {
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
                } else {
                    this._canvas.addMarker(me.id, 'Warning'); // Ou 'error' etc.
// API Overlays:
                    //window.alert(Get_functions(this._overlays).join(" - "));

                    // https://github.com/bpmn-io/bpmn-js-examples/tree/master/overlays
                    this._overlays.add(me.id/*, 'note'*/, { // 'note' n'a pas d'effet ???
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
    }

    private _validate_process = (): never | void => {
        const start_events: Array<ModdleElement> = this._process.flowElements.filter((flow_element: ModdleElement) => flow_element.$type === Event_type.BPMN_StartEvent);
        if (start_events.length === 0)
            throw new Error('No start event at all...');
        // Recursion starts from here:
        start_events.forEach(start_event => this._validate_BPMN_object(start_event));
    };
}

export default BPMN_checker;

/*window.addEventListener("contextmenu", (event: MouseEvent) => {
    alert("oncontextmenu");
    event.preventDefault();
});

window.addEventListener("DOMContentLoaded", () => {
    new BPMN_checker('./diagrams/diagram.bpmn');
});*/
