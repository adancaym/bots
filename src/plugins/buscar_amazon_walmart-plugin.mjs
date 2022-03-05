import {amazon} from "../scripts/amazon.mjs";
import {walmart} from "../scripts/walmart.mjs";

(async ()=> {
    await amazon('continue');
    await walmart();
})();
