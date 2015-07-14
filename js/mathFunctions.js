/**
 * Created by nick on 7/10/15.
 */

//math constants
const e = Math.E;
const pi = Math.PI;

//math functions
function rad(a){
    return a*pi/180;
}

function grade(a){
    return a*180/pi;
}

function putere(a,b){
    return Math.pow(a,b);
}

function radical(a,b){
    b = typeof b !== 'undefined' ? b : 2;
    return Math.pow(a,1/b);
}

function sin(a){
    return Math.sin(a);
}

function cos(a){
    return Math.cos(a);
}

function tg(a){
    return Math.tan(a);
}

function ctg(a){
    return 1/tg(a);
}

function ln(a){
    return Math.log(a);
}

function log(a,b){
    return ln(a) / ln(b);
}
