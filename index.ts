/// <reference path="JQuery.d.ts"/>

import * as $ from "jquery";
import {AvatarPreview, AvatarPreviewOptions} from "./AvatarPreview";
$.fn.avatarPreview = function(options?: AvatarPreviewOptions){
	const avatarPreview = new AvatarPreview(this, options);
};
