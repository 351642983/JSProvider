
function DropImg() {
  
  this._lastindex=0;
  this._allimglist;
  this._dropstatus={
  	nextstart:{"margin":"-10% -10%","width":"120%","height":"120%"},
  	nowend:{"marginLeft":'-100%'},
  	nowendtime:1000,
  	nextend:{"margin":'0 0',"width":"100%","height":"100%"},
  	nextendtime:1000
  };
}




DropImg.prototype.getPreindex = function() 
{
	return this._lastindex;
}
DropImg.prototype.setPreindex =function(index)
{
	this._lastindex=index;
}
DropImg.prototype.getImglist=function()
{
	return this._allimglist;
}
DropImg.prototype.setImglist=function(imglist)
{
	this._allimglist=imglist;
}
//nextstart,nowend,nextend
DropImg.prototype.setEffect=function(effect)
{
	for(var key in this._dropstatus){
		if(effect[key]!=null){
			this._dropstatus[key]=effect[key];
		}	
	}
}
DropImg.prototype.initPlayer=function(imglist)
{ 
	this.setImglist(imglist);
	let ncount=imglist.length*2;
	for(var i=0;i<imglist.length;i++){
		ncount-=2;
		imglist.eq(i).css("z-index",ncount);
	}
}
DropImg.prototype.playerStart=function(nextindex)
{
	this.getImglist().eq(nextindex%this.getImglist().length).animate(this._dropstatus.nextend,this._dropstatus.nextendtime);
	this.getImglist().eq(this.getPreindex()%this.getImglist().length).animate(this._dropstatus.nowend,this._dropstatus.nowendtime);
}
DropImg.prototype.playerEnd=function(index)
{	
	let ncount=this.getImglist().length*2;
	for(var i=index;i<index+this.getImglist().length;i++){
		ncount-=2;
		this.getImglist().eq(i%this.getImglist().length).css({
			"z-index":ncount
		});
	}
	this.setPreindex(index);
}

DropImg.prototype.playerNext=function()
{
	this.playerPlay((this.getPreindex()+1)%(this.getImglist().length));
}
DropImg.prototype.playerPrev=function()
{
	this.playerPlay((this.getPreindex()+this.getImglist().length-1)%(this.getImglist().length));
}
DropImg.prototype.playerPlay=function(index)
{
	this.getImglist().eq(index%this.getImglist().length).css("z-index",parseInt(this.getImglist().eq(this.getPreindex()).css("z-index"))-1);
	for(var i=0;i<this.getImglist().length;i++){
		
		if(i==(this.getPreindex()%this.getImglist().length))
			continue;
		this.getImglist().eq(i).css(this._dropstatus.nextstart);
	}
	this.playerStart(index);
	function EndSend(a,index){
		setTimeout(function(){a.playerEnd(index)},Math.max(a._dropstatus.nextendtime,a._dropstatus.nowendtime));
	}
	EndSend(this,index);
	
}