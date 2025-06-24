import fetch from "./fetch";
import observeEntries from "./observiceEntries";
import observeLoad from "./observerLoad";
import observerFCP from "./observerFCP";
import observerLCP from './observerLCP';
import observerPaint from './observerPaint'
import xhr from "./xhr";

export default function performance(){
    fetch();
    observeEntries();
    observeLoad();
    observerFCP();
    observerLCP();
    observerPaint();
    xhr();
}