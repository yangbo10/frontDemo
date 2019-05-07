//left menu height
$(function(){if($("#left").height()<$(window).height()-200){$("#left").css("height",$(window).height()-200)}})
$(function(){if($("#left").height()<$("#right").height()){$("#left").css("height",$("#right").height())}})

//top menu display/hide toggle
var top_menu = false;
function toggle_top_menu(){
	if(!top_menu){
		$("#top").css("top",116);
		$("#top_side_menu_arrow1").css("transform","rotate(180deg)");
		$("#top_side_menu_arrow2").css("transform","rotate(180deg)");
		$("#top_side_menu_arrow2").css("margin-bottom",10);
		top_menu=true;
	}else{
		$("#top").css("top",-196);
		$("#top_side_menu_arrow1").css("transform","rotate(0deg)");
		$("#top_side_menu_arrow2").css("transform","rotate(0deg)");
		$("#top_side_menu_arrow2").css("margin-bottom",0);
		top_menu=false;
	}
}

//dot icon select
function chkOption(obj){
	$(obj).children("img").attr("src","images/1-3/u387_selected.png");
}

//left menu mouse hover toggle
function toggle_menuitem(obj){
	var tmp = obj.src;
	if(tmp.indexOf('mouseOver')==-1){
		tmp = tmp.replace(/\.svg/,"_mouseOver.svg");
	}else{
		tmp = tmp.replace(/\_mouseOver/,"");
	}
	obj.src = tmp;
}
