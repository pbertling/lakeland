var IntroScene = function()
{
  var self = this;

  self.resize = function()
  {
    if(self.keyer) self.keyer.detach(); self.keyer = new Keyer({source:gg.canvas});
  }

  self.killinput = function()
  {
    if(self.keyer) self.keyer.flush();
  }

  self.ready = function()
  {
    self.resize();
    t = 0;

    txts = [
      loc[lang]["intro_Yousetouttoformanewtowncalled\"Lakeland.\""],
      loc[lang]["intro_Yourpeoplelovetoplayinthewater."],
      loc[lang]["intro_Growyourtownwithoutdestroyingtheirlakes."],
    ];
    if(AUDIO)
    {
      music_aud = gg.aud_wrangler.register_music("assets/audio/game_music.mp3");
      gg.aud_wrangler.play_music();
    }
  };

  var t = 0;
  var txt_len = 200;
  var txts;

  self.tick = function()
  {
    t++;
    if(t == 2) gg.game.scenes[3].ready();
    if(t > txts.length*txt_len) gg.game.nextScene();
    else self.keyer.filterkey(function(evt){ if(evt.keyCode == 32) gg.game.nextScene(); });
    if(self.keyer) self.keyer.flush();
  };

  self.draw = function()
  {
    gg.ctx.font = floor(20*gg.stage.s_mod)+"px LeagueSpartan";
    gg.ctx.globalAlpha = 1;
    gg.ctx.fillStyle = white;
    gg.ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);
    gg.ctx.fillStyle = black;
    if(t == 1)
    {
      gg.ctx.textAlign = "left";
      gg.ctx.fillText(loc[lang]["GeneratingLakeland..."],10,gg.canvas.height-10);
    }
    else
    {
      var i = floor(t/txt_len);
      gg.ctx.textAlign = "center";
      gg.ctx.fillStyle = black;
      var p = (t-(i*txt_len))/txt_len;
           if(p < 0.1) gg.ctx.globalAlpha = p*10;
      else if(p > 0.9) gg.ctx.globalAlpha = 1-((p-0.9)*10);
      gg.ctx.fillText(txts[i],gg.canvas.width/2,gg.canvas.height/2);
    }
  };

  self.cleanup = function()
  {
    if(self.keyer) self.keyer.detach(); self.keyer = null;
  };
};

