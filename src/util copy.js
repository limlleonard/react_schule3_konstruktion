export const width=600;
export const height=600;
const FE1=[width/2, height/2]; // F1 für Ellipse
const FE2=[width / 2 - width / 5, height / 2];
const FH1=[width * 3 / 4, height / 2];
const FH2=[width / 2, height / 2];
const FP=[width / 2, height / 2];
const Rpoint=5; // der Radius einer Punkte
const rEllipse=width/2*0.8;
const yParabel=height * 3 / 4;
const rHyperbel=width / 6;
const rParabel=width / 8;

const angles=[[],[],[]];
for (let a = Math.PI; a < 3 * Math.PI; a += Math.PI / 12) {
    angles[0].push(a);
}
for (let a = Math.PI; a < Math.PI*5/4; a += Math.PI / 15) {
    angles[1].push(a);
    if (a!==Math.PI) angles[1].push(-a);
}
// Es ist kein Winkel, aber wird es so genannt für die Einheitlichkeit
for (let x = 0; x <= width/2; x += width/8) {
    angles[2].push(x);
    if (x!==0) angles[2].push(-x);
}
let points=[]; // Finale Punkte
export const resetPoints = () => {points=[]};

export const vorbereitungen=[
    [
        "Zwei Punkte F1 und F2 festlegen",
        "Ein Kreis um F1 ziehen (F2 muss im Kreis sein)"
    ],
    [
        "Zwei Punkte F1 und F2 festlegen",
        "Ein Kreis um F1 ziehen (F2 muss außerhalb vom Kreis sein)"
    ],
    [
        "Ein Punkt und eine Gerade festlegen",
    ],
]
export const anweisungen=[
    ["Einen beliebigen Punkt E auf dem Kreislinie festlegen",
    "Die Strecke EF1 ziehen",
    "Die Strecke EF2 ziehen",
    "Ein Kreis um E mit r=EF2 ziehen",
    "Ein Kreis um F2 mit r=EF2 ziehen",
    "Die 2 Kreisen schneiden sich auf 2 Punkte",
    "Eine Gerade durch die 2 Schnittpunkte ziehen (Mittelsenkrechte)",
    "schneidet die Strecke EF2 auf S",
    "Diese Vorfahren wiederholen"],
    ['Einen beliebigen Punkt E auf dem Kreislinie festlegen',
    'Die Gerade EF1 ziehen',
    'Die Strecke EF2 ziehen',
    'Ein Kreis um E mit r=EF2 ziehen',
    'Ein Kreis um F2 mit r=EF2 ziehen',
    'Die 2 Kreisen schneiden sich auf 2 Punkte',
    'Eine Gerade durch die 2 Schnittpunkte ziehen (Mittelsenkrechte)',
    'schneidet die Gerade EF1 auf S',
    'Diese Vorfahren wiederholen'],
    ['Einen beliebigen Punkt B auf l festlegen',
    'Ein Kreis um B mit r ziehen',
    'Es schneidet die Gerade auf B1 und B2',
    'Ein Kreis um B1 mit 2r ziehen',
    'Ein Kreis um B2 mit 2r ziehen',
    'Die zwei Kreisen schneiden sich auf 2 Punkte',
    'Eine Gerade durch die 2 Punkte ziehen (Eine Senkrechte durch B)',
    'Die Strecke BF ziehen',
    'Ein Kreis um B mit r=BF ziehen',
    'Ein Kreis um F mit r=BF ziehen',
    'Die zwei Kreisen schneiden sich auf 2 Punkte',
    'Eine Gerade durch die 2 Punkte ziehen (Mittelsenkrecht von BF)',
    'Die Mittelsenkrechte und die Senkrechte schneiden sich auf S (gesucht)',
    'Diese Vorfahren wiederholen']
]
export let sumSteps=[];
for (let i=0; i<3; i++) {
    sumSteps.push(vorbereitungen[i].length + angles[i].length*anweisungen[i].length);
}

function mlPoint(ctx, p1, color='white', r=Rpoint){ // draw point
    ctx.beginPath();
    ctx.arc(...p1, r, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
}

function mlCircle(ctx,p1, r, color='white'){
    ctx.beginPath();
    ctx.arc(...p1, r, 0, Math.PI*2);
    ctx.strokeStyle = color;
    ctx.stroke();
}
function mlLine(ctx, p1,p2,color='white'){
    ctx.beginPath();
    ctx.moveTo(...p1);
    ctx.lineTo(...p2);
    ctx.strokeStyle=color;
    ctx.stroke();
}
function mlText(ctx, p1,text) {
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    ctx.fillText(text, p1[0]+10, p1[1]+16);
}

function mlStrecke2Gerade(point1, point2, w, h) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) {
        // The two points are identical; no unique line can be defined.
        throw new Error("The two points must be distinct.");
    }
    const intersections = [];
    // Calculate intersection with the left edge (x = 0)
    if (dx !== 0) {
        const y = y1 + (0 - x1) * dy / dx;
        if (y >= 0 && y <= h) {
            intersections.push([0, y]);
        }
    }
    // Calculate intersection with the right edge (x = w)
    if (dx !== 0) {
        const y = y1 + (w - x1) * dy / dx;
        if (y >= 0 && y <= h) {
            intersections.push([w, y]);
        }
    }
    // Calculate intersection with the top edge (y = 0)
    if (dy !== 0) {
        const x = x1 + (0 - y1) * dx / dy;
        if (x >= 0 && x <= w) {
            intersections.push([x, 0]);
        }
    }
    // Calculate intersection with the bottom edge (y = h)
    if (dy !== 0) {
        const x = x1 + (h - y1) * dx / dy;
        if (x >= 0 && x <= w) {
            intersections.push([x, h]);
        }
    }
    if (intersections.length !== 2) {
        throw new Error("Line does not properly intersect the box at two points.");
    }
    return intersections;
}

// Input, center of two circles and the radius / distnace. Ouput: zwei schnittpunkte
function schnittKreise(p1, p2, distance) {
    const [x1, y1] = p1; // Center of the first circle
    const [x2, y2] = p2; // Center of the second circle
    const r1 = distance; // Radius of the first circle
    const r2 = distance; // Radius of the second circle
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(dx * dx + dy * dy); // Distance between the two centers
    // Check for no intersection
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) {
        return null; // No intersection points
    }
    // Calculate the distance from the first circle's center to the line joining the intersection points
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);
    // Coordinates of the point where the line through the circle intersection points crosses the line between the centers
    const x0 = x1 + (a * dx) / d;
    const y0 = y1 + (a * dy) / d;
    // Offset of the intersection points from (x0, y0)
    const rx = -(dy * h) / d;
    const ry = (dx * h) / d;
    // The two intersection points
    const intersection1 = [x0 + rx, y0 + ry];
    const intersection2 = [x0 - rx, y0 - ry];
    return [intersection1, intersection2];
}
// Input: zwei Punkte einer strecke. Output: zwei Schnittunkts von der Mittelsenkrecht Gerade und Grenze der Canvas
function mittelsenkrecht(p1, p2){
    const [x1,y1]=p1;
    const [x2,y2]=p2;
    if (Math.abs(x1-x2)<1e-5){
        return [[0, y1/2+y2/2], [width, y1/2+y2/2]]
    } else if (Math.abs(y1-y2)<1e-5) {
        return [[x1/2+x2/2, 0], [x1/2+x2/2, height]]
    } else {
        const xm=x1/2+x2/2;
        const ym=y1/2+y2/2;
        const steig=(x1-x2)/(y2-y1);
      return [[0,ym-steig*xm], [width,steig*(width-xm)+ym]]
    }
}
// Input: 2* (2 Punkte der Strecke), Output: Schnittpunkt
function schnittGerade(p1,p2,p3,p4){
    const [x1, y1, x2, y2] = [p1[0], p1[1], p2[0], p2[1]];
    const [x3, y3, x4, y4] = [p3[0], p3[1], p4[0], p4[1]];
    const xs = ((x4 - x3) * (x2 * y1 - x1 * y2) - (x2 - x1) * (x4 * y3 - x3 * y4)) /
               ((y4 - y3) * (x2 - x1) - (y2 - y1) * (x4 - x3));
    const ys = ((y1 - y2) * (x4 * y3 - x3 * y4) - (y3 - y4) * (x2 * y1 - x1 * y2)) /
               ((y4 - y3) * (x2 - x1) - (y2 - y1) * (x4 - x3));
    return [xs, ys]
}
function abstand(p1,p2) {
    return ( (p1[0]-p2[0])**2+(p1[1]-p2[1])**2 )**0.5
}

function zeichnenVorbereiten(ctx, mode, nrVorbereitung){
    if (mode==0) {
        if (nrVorbereitung>-1) {
            // middle and left point
            mlPoint(ctx, FE1);
            mlText(ctx, FE1, "F1");
            mlPoint(ctx, FE2);
            mlText(ctx, FE2, "F2");
        }
        if (nrVorbereitung>0)
            // outer circle
            mlCircle(ctx, FE1, rEllipse);
    } else if (mode==1) {
        if (nrVorbereitung>-1) {
            // middle and left point
            mlPoint(ctx, FH1);
            mlText(ctx, FH1, "F1");
            mlPoint(ctx, FH2);
            mlText(ctx, FH2, "F2");
        }
        if (nrVorbereitung>0)
            mlCircle(ctx, FH1, rHyperbel);
    } else if (mode==2) {
        if (nrVorbereitung>-1) {
            // middle and left point
            mlPoint(ctx, FP);
            mlText(ctx, FP, "F");
            mlLine(ctx, [0, yParabel], [width, yParabel]);
            mlText(ctx, [0, yParabel], "l");
        }
    }
}

function zeichnenEllipse(ctx, nrAnweisung, angle, F1, F2) {
    // moving point
    let x=F1[0]+rEllipse*Math.cos(angle);
    let y=F1[1]+rEllipse*Math.sin(angle);
    let dist=abstand(F2, [x,y]);
    if (nrAnweisung!=anweisungen[0].length-1) {
        // beim letzten Schritt wird die Hilfszeichnungen nicht gezeigt
        if (nrAnweisung>-1) {
            mlPoint(ctx, [x,y], 'green');
            mlText(ctx, [x,y], "E");}
        if (nrAnweisung>0) {
            mlLine(ctx, [x,y], F1);}
        if (nrAnweisung>1) {
            mlLine(ctx, [x,y], F2);}
        // two circles
        if (nrAnweisung>2) {
            dist=abstand([x,y], F2);
            mlCircle(ctx, [x,y], dist);}
        if (nrAnweisung>3) {
            dist=abstand([x,y], F2);
            mlCircle(ctx, F2, dist);}
        // schnitt zwei kreise
        if (nrAnweisung>4) {
        const [pSchnittCircle1, pSchnittCircle2]=schnittKreise([x,y],F2, dist)
        mlPoint(ctx, pSchnittCircle1, 'blue');
        mlPoint(ctx, pSchnittCircle2, 'blue');}
        // senkrecht
        if (nrAnweisung>5) {
            const [p1,p2]=mittelsenkrecht([x,y], F2);
            const pSchnitt=schnittGerade(p1,p2,[x,y],F1);
            if (points.some(point => point[0] === pSchnitt[0] && point[1] === pSchnitt[1])) {
                points.pop(p1);
            }
            mlLine(ctx, p1, p2);}
    }
    // schneiden
    if (nrAnweisung>6) {
        const [p1,p2]=mittelsenkrecht([x,y], F2);
        const pSchnitt=schnittGerade(p1,p2,[x,y],F1);
        if (!points.some(point => point[0] === pSchnitt[0] && point[1] === pSchnitt[1])) {
            points.push(pSchnitt);
        }
    }
    for (const p1 of points) {
        mlPoint(ctx, p1, 'red');
    }
}
function zeichnenHyperbel(ctx, nrAnweisung, angle, F1, F2) {
    // moving point
    let x=F1[0]+rHyperbel*Math.cos(angle);
    let y=F1[1]+rHyperbel*Math.sin(angle);
    const dist=abstand([x,y], F2);
    if (nrAnweisung!=anweisungen[1].length-1) {
        if (nrAnweisung>-1) {
            mlPoint(ctx, [x,y], 'green');
            mlText(ctx, [x,y], "E");}
        if (nrAnweisung>0) {
            const [p1, p2]=mlStrecke2Gerade([x,y], F1, width, height);
            mlLine(ctx, p1,p2);}

        if (nrAnweisung>1) {
            mlLine(ctx, [x,y], F2);}
        // two circles
        if (nrAnweisung>2) {
            mlCircle(ctx, [x,y], dist);}
        if (nrAnweisung>3) {
            mlCircle(ctx, F2, dist);}
        // schnitt zwei kreise
        if (nrAnweisung>4) {
        const [pSchnittCircle1, pSchnittCircle2]=schnittKreise([x,y],F2, dist)
        mlPoint(ctx, pSchnittCircle1, 'blue');
        mlPoint(ctx, pSchnittCircle2, 'blue');}
        // senkrecht
        if (nrAnweisung>5) {
            const [p1,p2]=mittelsenkrecht([x,y], F2);
            const pSchnitt=schnittGerade(p1,p2,[x,y],F1);
            if (points.some(point => point[0] === pSchnitt[0] && point[1] === pSchnitt[1])) {
                points.pop(p1);
            }
            mlLine(ctx, p1, p2);}
    }
    // schneiden
    if (nrAnweisung>6) {
        const [p1,p2]=mittelsenkrecht([x,y], F2);
        const pSchnitt=schnittGerade(p1,p2,[x,y],F1);
        if (!points.some(point => point[0] === pSchnitt[0] && point[1] === pSchnitt[1])) {
            points.push(pSchnitt);
        }
    }
    for (const p1 of points) {
        mlPoint(ctx, p1, 'red');
    }
}
function zeichnenParabel(ctx, nrAnweisung, angle, F) {
    // moving point
    let x=width/2+angle;
    let y=yParabel;
    let p1=[];
    let p2=[];
    let p3=[];
    let p4=[];
    const dist=abstand([x,y],F)
    if (nrAnweisung!=anweisungen[2].length-1) {
        if (nrAnweisung>-1) {
            mlPoint(ctx, [x,y], 'green');
            mlText(ctx, [x,y], "B");};
        if (nrAnweisung>0) {
            mlCircle(ctx, [x,y], rParabel);}
        if (nrAnweisung>1) {
            mlPoint(ctx, [x-rParabel,y]);
            mlText(ctx, [x-rParabel,y], "B1");
            mlPoint(ctx, [x+rParabel,y]);
            mlText(ctx, [x+rParabel,y], "B2");}
        // two circles
        if (nrAnweisung>2) {
            mlCircle(ctx, [x-rParabel,y], rParabel*2)
        }
        if (nrAnweisung>3) {
            mlCircle(ctx, [x+rParabel,y], rParabel*2)
        }
        // schnitt zwei kreise
        if (nrAnweisung>4) {
        const [pSchnittCircle1, pSchnittCircle2]=schnittKreise([x+rParabel,y],[x-rParabel, y], rParabel*2);
        mlPoint(ctx, pSchnittCircle1, 'blue');
        mlPoint(ctx, pSchnittCircle2, 'blue');}
        // senkrecht
        if (nrAnweisung>5) {
            [p1,p2]=mittelsenkrecht([x+rParabel,y],[x-rParabel, y]);
            mlLine(ctx, p1,p2);
            // if (points.some(point => point[0] === pSchnitt[0] && point[1] === pSchnitt[1])) {
            //     points.pop(p1);
        }
        if (nrAnweisung>6) {
            mlLine(ctx, [x,y],F);
        }
        if (nrAnweisung>7) {
            mlCircle(ctx, [x,y],dist);
        }
        if (nrAnweisung>8) {
            mlCircle(ctx, F,dist);
        }
        if (nrAnweisung>9) {
            const [pSchnittCircle3, pSchnittCircle4]=schnittKreise([x,y],F, dist);
            mlPoint(ctx, pSchnittCircle3, 'blue');
            mlPoint(ctx, pSchnittCircle4, 'blue');
        }
        if (nrAnweisung>10) {
            [p1,p2]=mittelsenkrecht([x+rParabel,y],[x-rParabel, y]);
            [p3,p4]=mittelsenkrecht([x,y],F);
            const pSchnitt=schnittGerade(p1,p2,p3,p4);
            if (points.some(point => point[0] === pSchnitt[0] && point[1] === pSchnitt[1])) {
                points.pop(p1);
            }
            mlLine(ctx, p3,p4);
        }
    }
    // schneiden
    if (nrAnweisung>11) {
        [p1,p2]=mittelsenkrecht([x+rParabel,y],[x-rParabel, y]);
        [p3,p4]=mittelsenkrecht([x,y],F);
        const pSchnitt=schnittGerade(p1,p2,p3,p4);
        if (!points.some(point => point[0] === pSchnitt[0] && point[1] === pSchnitt[1])) {
            points.push(pSchnitt);
        }
    }
    for (const p1 of points) {
        mlPoint(ctx, p1, 'red');
    }
}

// there should be a overall function, which takes mode and step in, and choose itself, which function to use
export function zeichnen(ctx, mode, step) {
    const lenVor=vorbereitungen[mode].length;
    const lenAn=anweisungen[mode].length;
    zeichnenVorbereiten(ctx, mode, step);
    if (step>=lenVor) {
        const nrAnweisung=(step-lenVor) % lenAn;
        const nrRunde=Math.floor((step-lenVor) / lenAn);
        if (mode===0) {
            zeichnenEllipse(ctx, nrAnweisung, angles[mode][nrRunde], FE1, FE2)
        } else if (mode===1) {
            zeichnenHyperbel(ctx, nrAnweisung, angles[mode][nrRunde], FH1, FH2)
        } else if (mode===2) {
            zeichnenParabel(ctx, nrAnweisung, angles[mode][nrRunde], FP)
        }
    }
}