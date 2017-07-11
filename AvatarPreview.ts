import * as $ from "jquery";
import "jquery.growl";
export interface AvatarPreviewOptions {
	defaultPreview?: string;
	delete?: boolean|string;
	accept?: string[];
	maxSize?: number;
}
// tslint:disable-next-line:one-line
export class AvatarPreview{
	private options: AvatarPreviewOptions = {
		accept: ["jpg", "png", "gif"],
		delete: false,
		maxSize: 1024 * 1024,
	};
	private $preview: JQuery;
	private $file: JQuery;
	public constructor(private $element: JQuery, options?: AvatarPreviewOptions){
		if (typeof options !== "undefined"){
			for (const option in options){
				if (options.hasOwnProperty(option)){
					(this.options as any)[option] = (options as any)[option];
				}
			}
		}
		this.$preview = $("img.preview", $element);
		this.$file = $("input[type=file]", $element);
		this.run();
	}
	public checkImageType(type: string): boolean{
		switch (type){
			case("image/png"):
			case("image/jpg"):
			case("image/jpeg"):
			case("image/gif"):
				return true;
		}
		return false;
	}
	private run(){
		this.$preview.data("originalImage", this.$preview.attr("src"));
		this.$preview.data("backToDefault", true);
		const $btnRemove = $(".btn-remove", this.$element);
		if (!$btnRemove.data("default")){
			$btnRemove.hide();
		}
		const that = this;
		$(".btn-upload", this.$element).on("click", (e) => {
			e.preventDefault();
			this.$file.trigger("click");
		});
		$btnRemove.on("click", function(e){
			e.preventDefault();
			if (!that.$preview.data("backToDefault")){
				that.$preview.attr("src", that.$preview.data("originalImage"));
				that.$preview.data("backToOriginal", false);
				that.$file.val("");
				if (!$(this).data("default")){
					$(this).hide();
				}
				that.$preview.data("backToDefault", true);
				that.$element.trigger("bootstrap.avatar.preview.remove");
			}else{
				const defaultImage: string = $(this).data("default");
				if (defaultImage){
					that.$file.val("");
					that.$preview.attr("src", defaultImage);
					const emptyInput = that.$file.attr("name") + "_remove";
					if ($(`input[name=${emptyInput}]`, that.$element).length === 0){
						that.$element.append(`<input type="hidden" name="${emptyInput}" value="1" />`);
					}
					$(this).hide();
					that.$element.trigger("bootstrap.avatar.preview.remove");
				}
			}
		});
		this.$file.on("change", function(){
			if (this.files && this.files[0]) {
				const file: File = this.files[0];
				if (!that.checkImageType(file.type)){
					$.growl.error({title: "خطا", message: "نوع این فایل معتبر نیست"});
					return false;
				}
				if (file.size > that.options.maxSize){
					$.growl.error({title: "خطا", message: "حجم این فایل بیشتر از حد تعیین شده است."});
					return false;
				}
				const reader = new FileReader();
				reader.onload = (e) => {
					that.$preview.data("backToDefault", false);
					$btnRemove.show();
					that.$preview.attr("src", reader.result);
				};
				reader.readAsDataURL(this.files[0]);
				const emptyInput = that.$file.attr("name") + "_remove";
				const $emptyInput = $(`input[name=${emptyInput}]`, that.$element);
				if ($emptyInput.length){
					$emptyInput.remove();
				}
				that.$element.trigger("bootstrap.avatar.preview.change");
			}
		});
		this.$element.trigger("bootstrap.avatar.preview.init");
	}
}
