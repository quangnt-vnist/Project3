import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    classes as svgClasses,
    create as svgCreate
} from 'tiny-svg';

import {
    getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    is,
    getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
    TASK_BORDER_RADIUS = 5,
    COLOR_GREEN = '#52B415',
    COLOR_YELLOW = '#ffc800',
    COLOR_RED = '#cc0000';


export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;

    }

    canRender(element) {

        // ignore labels
        return !element.labelTarget;
    }



    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        let responsible = element.businessObject.$attrs.responsibleName ? element.businessObject.$attrs.responsibleName.split(",") : ""
        let responsibleName = ""
        let i
        for (i = 0; i < responsible.length; i++) {
            if (i !== responsible.length - 1) {
                responsibleName = responsibleName + responsible[i] + ", "
            } else {
                responsibleName = responsibleName + responsible[i]
            }
        }
        let accountable = element.businessObject.$attrs.accountableName ? element.businessObject.$attrs.accountableName.split(",") : ""
        let accountableName = ""
        for (i = 0; i < accountable.length; i++) {
            if (i !== accountable.length - 1) {
                accountableName = accountableName + accountable[i] + ", "
            } else {
                accountableName = accountableName + accountable[i]
            }
        }
        if (element.type == 'bpmn:Task') {
            element.height = 130;
            element.width = 160;
            let b = element.businessObject.$attrs.shapeName
            const line = drawLine(parentNode, 0, 50, 160, 50, 'black');

            let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');

            //Vẽ tên của công việc lên shape
            foreignObject.setAttribute('x', 5);
            foreignObject.setAttribute('y', 5);
            foreignObject.setAttribute('height', 35);
            foreignObject.setAttribute('width', 150);

            let div = document.createElement('div');
            let att = document.createAttribute("class");        // Create a "href" attribute
            att.value = "task-process-title";            // Set the value of the href attribute
            div.setAttributeNode(att);

            att = document.createAttribute("style");        // Create a "href" attribute
            div.setAttributeNode(att);

            div.innerHTML = b ? b : "";
            foreignObject.appendChild(div);
            svgAppend(parentNode, foreignObject);


            //Vẽ người thực hiện công việc
            let foreignObject1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            foreignObject1.setAttribute('x', 5);
            foreignObject1.setAttribute('y', 60);
            foreignObject1.setAttribute('height', 60);
            foreignObject1.setAttribute('width', 150);

            let div1 = document.createElement('div');
            let att1 = document.createAttribute("class");        // Create a "href" attribute
            att1.value = "list-task-process-responsible";            // Set the value of the href attribute
            div1.setAttributeNode(att1);

            att1 = document.createAttribute("style");        // Create a "href" attribute
            div1.setAttributeNode(att1);
            div1.innerHTML = responsibleName ? responsibleName : "";
            foreignObject1.appendChild(div1);


            let div2 = document.createElement('div');
            let att2 = document.createAttribute("class");        // Create a "href" attribute
            att2.value = "list-task-process-accountable";            // Set the value of the href attribute
            div2.setAttributeNode(att2);
            att2 = document.createAttribute("style");        // Create a "href" attribute
            div2.setAttributeNode(att2);
            div2.innerHTML = accountableName ? accountableName : "";
            foreignObject1.appendChild(div2);
            svgAppend(parentNode, foreignObject1);


            let progress = element.businessObject.$attrs.progress

            //Vẽ người thực hiện công việc
            let foreignObject2 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            foreignObject2.setAttribute('x', 120);
            foreignObject2.setAttribute('y', 110);
            foreignObject2.setAttribute('height', 30);
            foreignObject2.setAttribute('width', 40);

            let div3 = document.createElement('div');
            let att3 = document.createAttribute("class");        // Create a "href" attribute
            att3.value = "progress-task-process";            // Set the value of the href attribute
            div3.setAttributeNode(att3);

            att3 = document.createAttribute("style");        // Create a "href" attribute
            div3.setAttributeNode(att3);

            div3.innerHTML = progress ? progress + "%" : "0%";
            foreignObject2.appendChild(div3);
            svgAppend(parentNode, foreignObject2);

        }


        if (element.type == 'bpmn:ExclusiveGateway') {
            //Vẽ tên của công việc lên shape
            let b = element.businessObject.$attrs.shapeName
            let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            foreignObject.setAttribute('x', -50);
            foreignObject.setAttribute('y', -45);
            foreignObject.setAttribute('height', 35);
            foreignObject.setAttribute('width', 150);


            //tao div cha
            let parentDiv = document.createElement("div");
            let parentAtt = document.createAttribute("class");
            parentAtt.value = "parent-task-process-gate-way-title";
            parentDiv.setAttributeNode(parentAtt);
            parentAtt = document.createAttribute("style");
            parentDiv.setAttributeNode(parentAtt);

            //tao div con
            let div = document.createElement('div');
            let att = document.createAttribute("class");        // Create a "href" attribute
            att.value = "task-process-gate-way-title";            // Set the value of the href attribute
            div.setAttributeNode(att);
            att = document.createAttribute("style");        // Create a "href" attribute
            div.setAttributeNode(att);
            div.innerHTML = b ? b : "";

            parentDiv.appendChild(div)

            foreignObject.appendChild(parentDiv);
            svgAppend(parentNode, foreignObject);



            //Vẽ người thực hiện công việc
            let foreignObject1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            foreignObject1.setAttribute('x', -50);
            foreignObject1.setAttribute('y', 60);
            foreignObject1.setAttribute('height', 70);
            foreignObject1.setAttribute('width', 150);

            let div1 = document.createElement('div');
            let att1 = document.createAttribute("class");        // Create a "href" attribute
            att1.value = "list-task-process-gate-way-responsible";            // Set the value of the href attribute
            div1.setAttributeNode(att1);
            att1 = document.createAttribute("style");        // Create a "href" attribute
            div1.setAttributeNode(att1);
            div1.innerHTML = responsibleName ? responsibleName : "";
            foreignObject1.appendChild(div1);


            let div2 = document.createElement('div');
            let att2 = document.createAttribute("class");        // Create a "href" attribute
            att2.value = "list-task-process-gate-way-accountable";            // Set the value of the href attribute
            div2.setAttributeNode(att2);
            att2 = document.createAttribute("style");        // Create a "href" attribute
            div2.setAttributeNode(att2);
            div2.innerHTML = accountableName ? accountableName : "";
            foreignObject1.appendChild(div2);


            let div3 = document.createElement('div');
            let att3 = document.createAttribute("class");        // Create a "href" attribute
            att3.value = "gate-way-progress";            // Set the value of the href attribute
            div3.setAttributeNode(att3);
            att3 = document.createAttribute("style");        // Create a "href" attribute
            div3.setAttributeNode(att3);
            let progress = element.businessObject.$attrs.progress
            div3.innerHTML = progress ? progress + "%" : "0%";
            foreignObject1.appendChild(div3);
            svgAppend(parentNode, foreignObject1);
        }
        return shape;
    }

    getShapePath(shape) {
        if (is(shape, 'bpmn:Task')) {
            return getRoundRectPath(shape, TASK_BORDER_RADIUS);
        }

        return this.bpmnRenderer.getShapePath(shape);
    }

    getSuitabilityScore(element) {
        const businessObject = getBusinessObject(element);

        const { suitable } = businessObject;

        return Number.isFinite(suitable) ? suitable : null;
    }

    getColor(suitabilityScore) {
        if (suitabilityScore > 75) {
            return COLOR_GREEN;
        } else if (suitabilityScore > 25) {
            return COLOR_YELLOW;
        }

        return COLOR_RED;
    }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
    const rect = svgCreate('rect');

    svgAttr(rect, {
        width: width,
        height: height,
        rx: borderRadius,
        ry: borderRadius,
        stroke: color,
        strokeWidth: 2,
        fill: color
    });

    svgAppend(parentNode, rect);

    return rect;
}

function drawLine(parentNode, x1, y1, x2, y2, color) {
    const line = svgCreate('line');

    svgAttr(line, {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: color,
        fill: color,
        strokeWidth: 1,
    });

    svgAppend(parentNode, line);

    return line;
}




