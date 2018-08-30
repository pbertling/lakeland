var ENUM;

ENUM = 0;
var THING_TYPE_NULL    = ENUM; ENUM++;
var THING_TYPE_TILE    = ENUM; ENUM++;
var THING_TYPE_ITEM    = ENUM; ENUM++;
var THING_TYPE_FARMBIT = ENUM; ENUM++;
var THING_TYPE_COUNT   = ENUM; ENUM++;

ENUM = 0;
var TILE_TYPE_NULL      = ENUM; ENUM++;
var TILE_TYPE_LAND      = ENUM; ENUM++;
var TILE_TYPE_WATER     = ENUM; ENUM++;
var TILE_TYPE_SHORE     = ENUM; ENUM++;
var TILE_TYPE_FARM      = ENUM; ENUM++;
var TILE_TYPE_LIVESTOCK = ENUM; ENUM++;
var TILE_TYPE_STORAGE   = ENUM; ENUM++;
var TILE_TYPE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var TILE_STATE_NULL               = ENUM; ENUM++;
var TILE_STATE_FARM_UNPLANTED     = ENUM; ENUM++;
var TILE_STATE_FARM_PLANTED       = ENUM; ENUM++;
var TILE_STATE_FARM_GROWN         = ENUM; ENUM++;
var TILE_STATE_LIVESTOCK_IDLE     = ENUM; ENUM++;
var TILE_STATE_STORAGE_UNASSIGNED = ENUM; ENUM++;
var TILE_STATE_STORAGE_FOOD       = ENUM; ENUM++;
var TILE_STATE_STORAGE_POOP       = ENUM; ENUM++;
var TILE_STATE_COUNT              = ENUM; ENUM++;

ENUM = 0;
var ITEM_TYPE_NULL  = ENUM; ENUM++;
var ITEM_TYPE_FOOD  = ENUM; ENUM++;
var ITEM_TYPE_POOP  = ENUM; ENUM++;
var ITEM_TYPE_COUNT = ENUM; ENUM++;

ENUM = 0;
var ITEM_STATE_NULL  = ENUM; ENUM++;
var ITEM_STATE_COUNT = ENUM; ENUM++;

ENUM = 0;
var JOB_TYPE_NULL      = ENUM; ENUM++;
var JOB_TYPE_IDLE      = ENUM; ENUM++;
var JOB_TYPE_WAIT      = ENUM; ENUM++;
var JOB_TYPE_EAT       = ENUM; ENUM++;
var JOB_TYPE_SLEEP     = ENUM; ENUM++;
var JOB_TYPE_PLAY      = ENUM; ENUM++;
var JOB_TYPE_PLANT     = ENUM; ENUM++;
var JOB_TYPE_HARVEST   = ENUM; ENUM++;
var JOB_TYPE_FEED      = ENUM; ENUM++;
var JOB_TYPE_FERTILIZE = ENUM; ENUM++;
var JOB_TYPE_STORE     = ENUM; ENUM++;
var JOB_TYPE_KICK      = ENUM; ENUM++;
var JOB_TYPE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var JOB_STATE_NULL        = ENUM; ENUM++;
var JOB_STATE_GET         = ENUM; ENUM++;
var JOB_STATE_SEEK        = ENUM; ENUM++;
var JOB_STATE_ACT         = ENUM; ENUM++;
var JOB_STATE_IDLE_CHILL  = ENUM; ENUM++;
var JOB_STATE_IDLE_WANDER = ENUM; ENUM++;
var JOB_STATE_COUNT       = ENUM; ENUM++;

ENUM = 0;
var FARMBIT_STATE_NULL      = ENUM; ENUM++;
var FARMBIT_STATE_DESPERATE = ENUM; ENUM++;
var FARMBIT_STATE_MOTIVATED = ENUM; ENUM++;
var FARMBIT_STATE_CONTENT   = ENUM; ENUM++;
var FARMBIT_STATE_COUNT     = ENUM; ENUM++;

var fullness_job_for_b = function(b)
{
  /*
  //priorities:
  JOB_TYPE_EAT (spare food)
  JOB_TYPE_HARVEST
  JOB_TYPE_EAT (stored food)
  JOB_TYPE_PLANT
  JOB_TYPE_FERTILIZE
  */

  var job_type = JOB_TYPE_NULL;
  var job_subject = 0;
  var job_object = 0;
  var job_d = max_dist;
  var d;

  var it;
  for(var i = 0; i < gg.items.length; i++)
  {
    it = gg.items[i];
    t = it.tile;
    if(it.type == ITEM_TYPE_FOOD && !it.lock)
    {
      d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
      if(d < job_d)
      {
        job_type = JOB_TYPE_EAT; //spare food
        job_object = it;
        job_d = d;
      }
    }
  }

  if(job_type == JOB_TYPE_NULL)
  {
    var t;
    for(var i = 0; i < gg.b.tiles.length; i++)
    {
      t = gg.b.tiles[i];
      if(t.type == TILE_TYPE_FARM)
      {
        switch(job_type)
        {
          case JOB_TYPE_NULL:
            //break; //DON'T BREAK!
          case JOB_TYPE_FERTILIZE:
            if(t.state == TILE_STATE_FARM_PLANTED && !t.lock && t.nutrition < farm_nutrition_fertilize_threshhold)
            {
              if(job_type != JOB_TYPE_FERTILIZE) job_d = max_dist;
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job_type = JOB_TYPE_FERTILIZE;
                job_subject = t;
                job_object = 0; //set location of fertilizer later
                job_d = d;
              }
            }
            //break; //DON'T BREAK!
          case JOB_TYPE_PLANT:
            if(t.state == TILE_STATE_FARM_UNPLANTED && !t.lock)
            {
              if(job_type != JOB_TYPE_PLANT) job_d = max_dist;
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job_type = JOB_TYPE_PLANT;
                job_subject = t;
                job_object = 0;
                job_d = d;
              }
            }
            //break; //DON'T BREAK!
          case JOB_TYPE_HARVEST:
            if(t.state == TILE_STATE_FARM_GROWN && !t.lock)
            {
              if(job_type != JOB_TYPE_HARVEST) job_d = max_dist;
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job_type = JOB_TYPE_HARVEST;
                job_subject = t;
                job_object = 0;
                job_d = d;
              }
            }
            break;
          default:
            break;
        }
      }
      else if(t.type == TILE_TYPE_STORAGE)
      {
        if(job_type == JOB_TYPE_HARVEST) continue; //just take the harvest
        if(t.state == TILE_STATE_STORAGE_FOOD && t.val-t.withdraw_lock > 0)
        {
          if(job_type != JOB_TYPE_EAT) job_d = max_dist;
          d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
          if(d < job_d)
          {
            job_type = JOB_TYPE_EAT; //stored food
            job_subject = 0;
            job_object = t;
            job_d = d;
          }
        }
      }
    }
  }

  if(job_type == JOB_TYPE_FERTILIZE)
  { //make sure there is actually fertilizer to use
    job_d = max_dist;
    for(var i = 0; i < gg.items.length; i++)
    {
      it = gg.items[i];
      t = it.tile;
      if(it.type == ITEM_TYPE_POOP && !it.lock)
      {
        d = distsqr(t.tx,t.ty,job_subject.tx,job_subject.ty);
        if(d < job_d)
        {
          job_d = d;
          job_object = it;
        }
      }
    }

    if(!job_object)
    {
      job_d = max_dist;
      for(var i = 0; i < gg.b.tiles.length; i++)
      {
        t = gg.b.tiles[i];
        if(t.type == TILE_TYPE_STORAGE && t.state == TILE_STATE_STORAGE_POOP && t.val-t.withdraw_lock > 0)
        {
          d = distsqr(t.tx,t.ty,job_subject.tx,job_subject.ty);
          if(d < job_d)
          {
            job_d = d;
            job_object = t;
          }
        }
      }
    }

    if(!job_object)
    {
      job_type = JOB_TYPE_NULL;
      job_subject = 0;
    }
  }

  if(job_type != JOB_TYPE_NULL)
  {
    b.go_idle();
    b.job_type = job_type;
    b.job_subject = job_subject;
    b.job_object = job_object;
    switch(job_type)
    {
      case JOB_TYPE_EAT:
        if(b.job_object.thing == THING_TYPE_ITEM) b.job_object.lock = 1;
        if(b.job_object.thing == THING_TYPE_TILE) b.job_object.withdraw_lock++;
        b.job_state = JOB_STATE_GET;
        break;
      case JOB_TYPE_PLANT:
        b.job_subject.lock = 1;
        b.job_state = JOB_STATE_SEEK;
        break;
      case JOB_TYPE_FERTILIZE:
        if(b.job_object.thing == THING_TYPE_ITEM) b.job_object.lock = 1;
        if(b.job_object.thing == THING_TYPE_TILE) b.job_object.withdraw_lock++;
        b.job_subject.lock = 1;
        b.job_state = JOB_STATE_GET;
        break;
      case JOB_TYPE_HARVEST:
        b.job_subject.lock = 1;
        b.job_state = JOB_STATE_SEEK;
        break;
    }
    return 1;
  }
  return 0;
}

var energy_job_for_b = function(b)
{
  /*
  //priorities:
  JOB_TYPE_
  */

  var job_type = JOB_TYPE_NULL;
  var job_subject = 0;
  var job_object = 0;

  job_type = JOB_TYPE_SLEEP;
  job_subject = 0;
  job_object = 0;

  if(job_type != JOB_TYPE_NULL)
  {
    b.go_idle();
    b.job_type = job_type;
    b.job_subject = job_subject;
    b.job_object = job_object;
    b.job_state = JOB_STATE_SEEK;
    return 1;
  }
  return 0;
}

var joy_job_for_b = function(b)
{
  /*
  //priorities:
  JOB_TYPE_PLAY
  */

  var d;
  var job_d = max_dist;
  var job_type = JOB_TYPE_NULL;
  var job_subject = 0;
  var job_object = 0;
  var t;
  for(var i = 0; i < gg.b.tiles.length; i++)
  {
    t = gg.b.tiles[i];
    if(t.type == TILE_TYPE_WATER && !t.lock)
    {
      job_type = JOB_TYPE_PLAY;
      d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
      if(d < job_d)
      {
        job_subject = t;
        job_object = 0;
        job_d = d;
      }
    }
  }
  if(job_type != JOB_TYPE_NULL)
  {
    b.go_idle();
    b.job_type = job_type;
    b.job_subject = job_subject;
    b.job_object = job_object;
    b.job_state = JOB_STATE_SEEK;
    return 1;
  }
  return 0;
}

var fulfillment_job_for_b = function(b)
{
  /*
  //priorities:
  JOB_TYPE_FEED
  JOB_TYPE_FERTILIZE
  JOB_TYPE_STORE
  JOB_TYPE_HARVEST
  JOB_TYPE_PLANT
  JOB_TYPE_KICK
  */

  var job_type = JOB_TYPE_NULL;
  var job_subject = 0;
  var job_object = 0;

  var job_d = max_dist;
  var d;

  var t;
  var it;

  for(var i = 0; i < gg.items.length; i++)
  {
    it = gg.items[i];
    t = it.tile;
    if(!it.lock)
    {
      d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
      if(d < job_d)
      {
        job_type = JOB_TYPE_KICK; //overwrite kick to STORE if possible later
        job_subject = 0;
        job_object = it;
        job_d = d;
      }
    }
  }

  if(job_type == JOB_TYPE_KICK)
  { //try to convert to JOB_TYPE_STORE (look for available storage)
    job_d = max_dist;
    for(var i = 0; i < gg.b.tiles.length; i++)
    {
      t = gg.b.tiles[i];
      if(t.type == TILE_TYPE_STORAGE &&
          (
            t.state == TILE_STATE_STORAGE_UNASSIGNED ||
            (t.state == TILE_STATE_STORAGE_FOOD && job_object.type == ITEM_TYPE_FOOD && t.val+t.deposit_lock < storage_food_max) ||
            (t.state == TILE_STATE_STORAGE_POOP && job_object.type == ITEM_TYPE_POOP && t.val+t.deposit_lock < storage_poop_max)
          )
        )
      {
        d = distsqr(t.tx,t.ty,job_object.tile.tx,job_object.tile.ty);
        if(d < job_d)
        {
          job_type = JOB_TYPE_STORE;
          job_d = d;
          job_subject = t;
        }
      }
    }
  }

  if(job_type == JOB_TYPE_NULL ||
     job_type == JOB_TYPE_KICK)
  {
    job_d = max_dist;
    for(var i = 0; i < gg.b.tiles.length; i++)
    {
      t = gg.b.tiles[i];
      if(t.type == TILE_TYPE_FARM && job_type != JOB_TYPE_FEED)
      {
        switch(job_type)
        {
          case JOB_TYPE_NULL:
          case JOB_TYPE_KICK:
            //break; //DON'T BREAK!
          case JOB_TYPE_PLANT:
            if(t.state == TILE_STATE_FARM_UNPLANTED && !t.lock)
            {
              if(job_type != JOB_TYPE_PLANT) job_d = max_dist;
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job_type = JOB_TYPE_PLANT;
                job_subject = t;
                job_object = 0;
                job_d = d;
              }
            }
            //break; //DON'T BREAK!
          case JOB_TYPE_HARVEST:
            if(t.state == TILE_STATE_FARM_GROWN && !t.lock)
            {
              if(job_type != JOB_TYPE_HARVEST) job_d = max_dist;
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job_type = JOB_TYPE_HARVEST;
                job_subject = t;
                job_object = 0;
                job_d = d;
              }
            }
            //break; //DON'T BREAK!
          case JOB_TYPE_FERTILIZE:
            if(t.state == TILE_STATE_FARM_PLANTED && !t.lock && t.nutrition < farm_nutrition_fertilize_threshhold)
            {
              if(job_type != JOB_TYPE_FERTILIZE) job_d = max_dist;
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                var ob_d = max_dist;
                var ob;
                var od;
                var ot;
                for(var j = 0; j < gg.items.length; j++)
                {
                  it = gg.items[j];
                  ot = it.tile;
                  if(it.type == ITEM_TYPE_POOP && !it.lock)
                  {
                    od = distsqr(t.tx,t.ty,ot.tx,ot.ty);
                    if(od < ob_d)
                    {
                      ob_d = od;
                      ob = it;
                    }
                  }
                }

                if(!ob)
                {
                  ob_d = max_dist;
                  for(var j = 0; j < gg.b.tiles.length; j++)
                  {
                    var ot = gg.b.tiles[j];
                    if(ot.type == TILE_TYPE_STORAGE && ot.state == TILE_STATE_STORAGE_POOP && ot.val-ot.withdraw_lock > 0)
                    {
                      od = distsqr(ot.tx,ot.ty,t.tx,t.ty);
                      if(od < ob_d)
                      {
                        ob_d = od;
                        ob = ot;
                      }
                    }
                  }
                }

                if(ob)
                {
                  job_type = JOB_TYPE_FERTILIZE;
                  job_subject = t;
                  job_object = ob;
                  job_d = d;
                }
              }
            }
            break;
        }
      }
      else if(t.type == TILE_TYPE_LIVESTOCK)
      {
        switch(job_type)
        {
          case JOB_TYPE_NULL:
          case JOB_TYPE_KICK:
          case JOB_TYPE_PLANT:
          case JOB_TYPE_HARVEST:
          case JOB_TYPE_STORE:
          case JOB_TYPE_FERTILIZE:
          case JOB_TYPE_FEED:
          {
            if(t.val < livestock_feed_threshhold && !t.lock)
            {
              if(job_type != JOB_TYPE_FEED) job_d = max_dist;
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                var ob_d = max_dist;
                var ob;
                var od;
                var ot;
                for(var j = 0; j < gg.items.length; j++)
                {
                  it = gg.items[j];
                  ot = it.tile;
                  if(it.type == ITEM_TYPE_FOOD && !it.lock)
                  {
                    od = distsqr(ot.tx,ot.ty,t.tx,t.ty);
                    if(od < ob_d)
                    {
                      ob_d = od;
                      ob = it;
                    }
                  }
                }

                if(!ob)
                {
                  ob_d = max_dist;
                  for(var j = 0; j < gg.b.tiles.length; j++)
                  {
                    var ot = gg.b.tiles[j];
                    if(ot.type == TILE_TYPE_STORAGE && ot.state == TILE_STATE_STORAGE_FOOD && ot.val-ot.withdraw_lock > 0)
                    {
                      od = distsqr(ot.tx,ot.ty,t.tx,t.ty);
                      if(od < ob_d)
                      {
                        ob_d = od;
                        ob = ot;
                      }
                    }
                  }
                }

                if(ob)
                {
                  job_type = JOB_TYPE_FEED;
                  job_subject = t;
                  job_object = ob;
                  job_d = d;
                }
              }
            }
          }
            break;
        }
      }
    }
  }

  if(job_type != JOB_TYPE_NULL)
  {
    b.go_idle();
    b.job_type = job_type;
    b.job_subject = job_subject;
    b.job_object = job_object;
    switch(b.job_type)
    {
      case JOB_TYPE_FEED:
        if(b.job_object.thing == THING_TYPE_ITEM) b.job_object.lock = 1;
        if(b.job_object.thing == THING_TYPE_TILE) b.job_object.withdraw_lock++;
        b.job_subject.lock = 1;
        b.job_state = JOB_STATE_GET;
        break;
      case JOB_TYPE_FERTILIZE:
        if(b.job_object.thing == THING_TYPE_ITEM) b.job_object.lock = 1;
        if(b.job_object.thing == THING_TYPE_TILE) b.job_object.withdraw_lock++;
        b.job_subject.lock = 1;
        b.job_state = JOB_STATE_GET;
        break;
      case JOB_TYPE_STORE:
        b.job_state = JOB_STATE_GET;
        b.job_object.lock = 1;
        b.job_subject.deposit_lock++;
        if(b.job_object.type == ITEM_TYPE_FOOD) b.job_subject.state = TILE_STATE_STORAGE_FOOD;
        if(b.job_object.type == ITEM_TYPE_POOP) b.job_subject.state = TILE_STATE_STORAGE_POOP;
        break;
      case JOB_TYPE_HARVEST:
      case JOB_TYPE_PLANT:
        b.job_state = JOB_STATE_SEEK;
        b.job_subject.lock = 1;
        break;
      case JOB_TYPE_KICK:
        b.job_state = JOB_STATE_GET;
        b.job_object.lock = 1;
        break;
    }
    return 1;
  }
  return 0;
}

var job_for_b = function(b)
{
  /*
  //priorities:
  fullness
  energy
  joy
  fulfillment
  */

  if(b.job_type != JOB_TYPE_IDLE) return; //already busy!

  if(b.fullness_state     == FARMBIT_STATE_DESPERATE && fullness_job_for_b(b))     return;
  if(b.energy_state       == FARMBIT_STATE_DESPERATE && energy_job_for_b(b))       return;
  if(b.joy_state          == FARMBIT_STATE_DESPERATE && joy_job_for_b(b))          return;
  if(b.fulfillment_state  == FARMBIT_STATE_DESPERATE && fulfillment_job_for_b(b))  return;
  if(b.fullness_state     == FARMBIT_STATE_MOTIVATED && fullness_job_for_b(b))     return;
  if(b.energy_state       == FARMBIT_STATE_MOTIVATED && energy_job_for_b(b))       return;
  if(b.joy_state          == FARMBIT_STATE_MOTIVATED && joy_job_for_b(b))          return;
  if(b.fulfillment_state  == FARMBIT_STATE_MOTIVATED && fulfillment_job_for_b(b))  return;
  return;
}

var b_for_job = function(job_type, job_subject, job_object)
{
  var b;
  var t;
  var it;
  switch(job_type)
  {
    case JOB_TYPE_NULL:
    case JOB_TYPE_IDLE:
    case JOB_TYPE_WAIT:
      console.log("FINISH");//figure out what to do
      break;
    case JOB_TYPE_EAT:
    {
      /*
      //priorities:
      closest low fullness farmbit
      */

      var best;
      var b_rank = -1;
      var b_d = max_dist;
      var rank = -1;
      var d;
      it = job_object;
      t = it.tile;
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        b = gg.farmbits[i];
        if(b.job_type != JOB_TYPE_IDLE) continue;

             if(b.fullness_state == FARMBIT_STATE_DESPERATE) rank = 2;
        else if(b.fullness_state == FARMBIT_STATE_MOTIVATED) rank = 1;
        else                                                 rank = -1;

             if(rank > b_rank) { b_d = max_dist; d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty); }
        else if(rank < b_rank) {                 d = max_dist;                                }
        else                   {                 d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty); }

        if(d < b_d)
        {
          b_rank = rank;
          b_d = d;
          best = b;
        }
      }
      if(best)
      {
        best.job_type = JOB_TYPE_EAT;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.job_object.lock = 1;
        best.job_state = JOB_STATE_GET;
        best.job_state_t = 0;
        return 1;
      }
    }
      break;
    case JOB_TYPE_SLEEP:
    case JOB_TYPE_PLAY:
      console.log("FINISH"); //figure out what to do
      break;
    case JOB_TYPE_PLANT:
    case JOB_TYPE_HARVEST:
    {
      /*
      //priorities:
      closest low fullness bit
      closest low fulfillment bit
      */

      var best;
      var b_rank = -1;
      var b_d = max_dist;
      var rank = -1;
      var d;
      t = job_subject;
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        b = gg.farmbits[i];
        if(b.job_type != JOB_TYPE_IDLE) continue;

             if(b.fullness_state    == FARMBIT_STATE_DESPERATE) rank = 4;
        else if(b.fulfillment_state == FARMBIT_STATE_DESPERATE) rank = 3;
        else if(b.fullness_state    == FARMBIT_STATE_MOTIVATED) rank = 2;
        else if(b.fulfillment_state == FARMBIT_STATE_MOTIVATED) rank = 1;
        else                                                    rank = -1;

             if(rank > b_rank) { b_d = max_dist; d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty); }
        else if(rank < b_rank) {                 d = max_dist;                               }
        else                   {                 d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty); }

        if(d < b_d)
        {
          b_rank = rank;
          b_d = d;
          best = b;
        }
      }
      if(best)
      {
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.job_subject.lock = 1;
        best.job_state = JOB_STATE_SEEK;
        best.job_state_t = 0;
        return 1;
      }
    }
      break;
    case JOB_TYPE_FEED:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some farm and some fertilizer and get 'em goin"

      if(!job_subject)
      {
        job_d = max_dist;
        for(var i = 0; i < gg.b.tiles.length; i++)
        {
          t = gg.b.tiles[i];
          if(t.type == TILE_TYPE_LIVESTOCK && !t.lock && t.val < livestock_feed_threshhold)
          {
            d = distsqr(t.tx,t.ty,job_object.tile.tx,job_object.tile.ty);
            if(d < job_d)
            {
              job_subject = t;
              job_d = d;
            }
          }
        }
      }
      if(!job_subject) return 0;

      if(!job_object)
      { //look for free items
        job_d = max_dist;
        for(var i = 0; i < gg.items.length; i++)
        {
          it = gg.items[i];
          t = it.tile;
          if(it.type == ITEM_TYPE_FOOD && !it.lock)
          {
            d = distsqr(t.tx,t.ty,job_subject.tx,job_subject.ty);
            if(d < job_d)
            {
              job_object = it;
              job_d = d;
            }
          }
        }
      }

      if(!job_object)
      { //look for stored items
        job_d = max_dist;
        for(var i = 0; i < gg.b.tiles.length; i++)
        {
          if(t.type == TILE_TYPE_STORAGE && t.state == TILE_STATE_STORAGE_FOOD && t.val-t.withdraw_lock > 0)
          {
            d = distsqr(t.tx,t.ty,job_subject.tx,job_subject.ty);
            if(d < job_d)
            {
              job_object = t;
              job_d = d;
            }
          }
        }
      }
      if(!job_object) return 0;

      var best;
      var b_rank = -1;
      var b_d = max_dist;
      var rank = -1;
      var d;
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        b = gg.farmbits[i];
        if(b.job_type != JOB_TYPE_IDLE) continue;

             if(b.fulfillment_state == FARMBIT_STATE_DESPERATE) rank = 2;
        else if(b.fulfillment_state == FARMBIT_STATE_MOTIVATED) rank = 1;
        else                                                    rank = -1;

             if(rank > b_rank) { b_d = max_dist; d = distsqr(job_object.tile.tx,job_object.tile.ty,b.tile.tx,b.tile.ty); }
        else if(rank < b_rank) {                 d = max_dist;                                                           }
        else                   {                 d = distsqr(job_object.tile.tx,job_object.tile.ty,b.tile.tx,b.tile.ty); }

        if(d < b_d)
        {
          b_rank = rank;
          b_d = d;
          best = b;
        }
      }

      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        if(best.job_object.thing == THING_TYPE_ITEM) best.job_object.lock = 1;
        if(best.job_object.thing == THING_TYPE_TILE) best.job_object.withdraw_lock++;
        best.job_subject.lock = 1;
        best.job_state = JOB_STATE_GET;
        return 1;
      }
    }
      break;
    case JOB_TYPE_FERTILIZE:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some farm and some fertilizer and get 'em goin"

      if(!job_subject)
      {
        job_d = max_dist;
        for(var i = 0; i < gg.b.tiles.length; i++)
        {
          t = gg.b.tiles[i];
          if(t.type == TILE_TYPE_FARM && t.state == TILE_STATE_FARM_PLANTED && !t.lock && t.nutrition < farm_nutrition_fertilize_threshhold)
          {
            d = distsqr(t.tx,t.ty,job_object.tile.tx,job_object.tile.ty);
            if(d < job_d)
            {
              job_subject = t;
              job_d = d;
            }
          }
        }
      }
      if(!job_subject) return 0;

      if(!job_object)
      { //look for free items
        job_d = max_dist;
        for(var i = 0; i < gg.items.length; i++)
        {
          it = gg.items[i];
          t = it.tile;
          if(it.type == ITEM_TYPE_POOP && !it.lock)
          {
            d = distsqr(t.tx,t.ty,job_subject.tx,job_subject.ty);
            if(d < job_d)
            {
              job_object = it;
              job_d = d;
            }
          }
        }
      }

      if(!job_object)
      { //look for stored items
        job_d = max_dist;
        for(var i = 0; i < gg.b.tiles.length; i++)
        {
          if(t.type == TILE_TYPE_STORAGE && t.state == TILE_STATE_STORAGE_POOP && t.val-t.withdraw_lock > 0)
          {
            d = distsqr(t.tx,t.ty,job_subject.tx,job_subject.ty);
            if(d < job_d)
            {
              job_object = t;
              job_d = d;
            }
          }
        }
      }
      if(!job_object) return 0;

      var best;
      var b_rank = -1;
      var b_d = max_dist;
      var rank = -1;
      var d;
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        b = gg.farmbits[i];
        if(b.job_type != JOB_TYPE_IDLE) continue;

             if(b.fullness_state    == FARMBIT_STATE_DESPERATE) rank = 4;
        else if(b.fulfillment_state == FARMBIT_STATE_DESPERATE) rank = 3;
        else if(b.fullness_state    == FARMBIT_STATE_MOTIVATED) rank = 2;
        else if(b.fulfillment_state == FARMBIT_STATE_MOTIVATED) rank = 1;
        else                                                    rank = -1;

             if(rank > b_rank) { b_d = max_dist; d = distsqr(job_object.tile.tx,job_object.tile.ty,b.tile.tx,b.tile.ty); }
        else if(rank < b_rank) {                 d = max_dist;                                                           }
        else                   {                 d = distsqr(job_object.tile.tx,job_object.tile.ty,b.tile.tx,b.tile.ty); }

        if(d < b_d)
        {
          b_rank = rank;
          b_d = d;
          best = b;
        }
      }

      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        if(best.job_object.thing == THING_TYPE_ITEM) best.job_object.lock = 1;
        if(best.job_object.thing == THING_TYPE_TILE) best.job_object.withdraw_lock++;
        best.job_subject.lock = 1;
        best.job_state = JOB_STATE_GET;
        return 1;
      }
    }
      break;
    case JOB_TYPE_STORE:
    {
      /*
      //priorities:
      closest low fulfillment bit
      */

      if(!job_subject)
      {
        var job_d = max_dist;
        for(var i = 0; i < gg.b.tiles.length; i++)
        {
          t = gg.b.tiles[i];
          if(t.type == TILE_TYPE_STORAGE &&
              (
                t.state == TILE_STATE_STORAGE_UNASSIGNED ||
                (t.state == TILE_STATE_STORAGE_FOOD && job_object.type == ITEM_TYPE_FOOD && t.val+t.deposit_lock < storage_food_max) ||
                (t.state == TILE_STATE_STORAGE_POOP && job_object.type == ITEM_TYPE_POOP && t.val+t.deposit_lock < storage_poop_max)
              )
            )
          {
            d = distsqr(t.tx,t.ty,job_object.tile.tx,job_object.tile.ty);
            if(d < job_d)
            {
              job_d = d;
              job_subject = t;
            }
          }
        }
      }
      if(!job_subject) return 0;

      var best;
      var b_rank = -1;
      var b_d = max_dist;
      var rank = -1;
      var d;
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        b = gg.farmbits[i];
        if(b.job_type != JOB_TYPE_IDLE) continue;

             if(b.fullness_state    == FARMBIT_STATE_DESPERATE) rank = 4;
        else if(b.fulfillment_state == FARMBIT_STATE_DESPERATE) rank = 3;
        else if(b.fullness_state    == FARMBIT_STATE_MOTIVATED) rank = 2;
        else if(b.fulfillment_state == FARMBIT_STATE_MOTIVATED) rank = 1;
        else                                                    rank = -1;

             if(rank > b_rank) { b_d = max_dist; d = distsqr(job_object.tile.tx,job_object.tile.ty,b.tile.tx,b.tile.ty); }
        else if(rank < b_rank) {                 d = max_dist;                                                           }
        else                   {                 d = distsqr(job_object.tile.tx,job_object.tile.ty,b.tile.tx,b.tile.ty); }

        if(d < b_d)
        {
          b_rank = rank;
          b_d = d;
          best = b;
        }
      }
      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.job_state = JOB_STATE_GET;
        best.job_object.lock = 1;
        best.job_subject.deposit_lock++;
        if(best.job_object.type == ITEM_TYPE_FOOD) best.job_subject.state = TILE_STATE_STORAGE_FOOD;
        if(best.job_object.type == ITEM_TYPE_POOP) best.job_subject.state = TILE_STATE_STORAGE_POOP;
        return 1;
      }
    }
      break;
    case JOB_TYPE_KICK:
    {
      console.log("FINISH");//figure out
    }
      break;
    default:
      break;
  }
}

var break_item = function(it)
{
  for(var i = 0; i < gg.items.length; i++)
    if(gg.items[i] == it) gg.items.splice(i,1);
}

var kick_item = function(it)
{
  var theta = rand()*twopi;
  var s = 2+rand()*5;
  it.wvx = cos(theta)*s;
  it.wvy = sin(theta)*s;
  it.wvz = s/2;
}

var tile = function()
{
  var self = this;
  self.thing = THING_TYPE_TILE;

  self.tile = self; //trick that allows all thing.tile to reference a tile
  self.tx = 0;
  self.ty = 0;
  self.type = TILE_TYPE_LAND;
  self.state = TILE_STATE_NULL;
  self.state_t = 0;
  self.val = 0;
  self.nutrition = 0;
  self.withdraw_lock = 0;
  self.deposit_lock = 0;
  self.lock = 0;
}

var board = function()
{
  var self = this;

  self.tw = board_w;
  self.th = board_h;
  self.tiles = [];
  self.tiles_i = function(tx,ty)
  {
    if(tx <  0)       tx += self.tw;
    if(ty <  0)       ty += self.th;
    if(tx >= self.tw) tx -= self.tw;
    if(ty >= self.th) ty -= self.th;
    return self.tw*ty+tx;
  }
  self.tiles_t = function(tx,ty)
  {
    return self.tiles[self.tiles_i(tx,ty)];
  }
  self.tiles_wt = function(wx,wy)
  {
    var tx = floor(clampMapVal(self.wx-self.ww/2, self.wx+self.ww/2+1, 0, self.tw, wx));
    var ty = floor(clampMapVal(self.wy-self.wh/2, self.wy+self.wh/2+1, 0, self.th, wy));
    return self.tiles_t(tx,ty);
  }
  self.tiles_tw = function(t,w)
  {
    w.wx = self.wx-self.ww/2+((t.tx+0.5)*self.ww/self.tw);
    w.wy = self.wy-self.wh/2+((t.ty+0.5)*self.wh/self.th);
  }
  self.shuffle_i = [];

  self.wx = 0;
  self.wy = 0;
  self.ww = 660;
  self.wh = 660;

  self.wrapw = function(o)
  {
    if(o.wx < self.wx-self.ww/2) o.wx = self.wx+self.ww/2;
    if(o.wx > self.wx+self.ww/2) o.wx = self.wx-self.ww/2;
    if(o.wy < self.wy-self.wh/2) o.wy = self.wy+self.wh/2;
    if(o.wy > self.wy+self.wh/2) o.wy = self.wy-self.wh/2;
  }

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.hovering;
  self.hover_t;

  self.init = function()
  {
    for(var ty = 0; ty < self.th; ty++)
      for(var tx = 0; tx < self.tw; tx++)
      {
        var i = self.tiles_i(tx,ty);
        var t = new tile();
        t.tx = tx;
        t.ty = ty;
        t.nutrition = rand();
        t.nutrition *= t.nutrition;
        t.nutrition *= t.nutrition;
        t.nutrition *= t.nutrition;
        t.nutrition *= t.nutrition;
        self.tiles[i] = t;
      }

    var atomic_push = function(n,ar)
    {
      var found = false;
      for(var j = 0; j < ar.length; j++) if(ar[j] == n) found = true;
      if(!found) ar.push(n);
    }

    var slow_flood_fill = function(fill)
    {
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type == t.type) atomic_push(n,fill);
      }
      return fill;
    }

    var slow_flood_border = function(fill)
    {
      var border = [];
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type != t.type) atomic_push(n,border);
      }
      return border;
    }

    var n_lakes = 4;
    for(var i = 0; i < n_lakes; i++)
    {
      var src_tx = randIntBelow(self.tw);
      var src_ty = randIntBelow(self.th);
      var t = self.tiles_t(src_tx,src_ty);
      t.type = TILE_TYPE_WATER;
      var lake_size = 200+randIntBelow(400);
      var lake_tiles = slow_flood_fill([t]);
      var lake_border = slow_flood_border(lake_tiles);

      for(var j = 0; j < lake_size; j++)
      {
        var b_i = randIntBelow(lake_border.length);
        var t = lake_border[b_i];
        t.type = TILE_TYPE_WATER;
        lake_tiles.push(t);
        lake_border.splice(b_i,1);

        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type != t.type) atomic_push(n,lake_border);
      }
      for(var j = 0; j < lake_border.length; j++)
        lake_border[j].type = TILE_TYPE_SHORE;
    }

    var n = self.tw*self.th;
    for(var i = 0; i < n; i++) self.shuffle_i[i] = i;

    self.hovering = 0;
  }
  self.init();

  self.shuffle = function()
  {
    var n = self.tw*self.th;
    for(var i = 0; i < n; i++)
    {
      var val = self.shuffle_i[i];
      var swap = randIntBelow(n-i);
      self.shuffle_i[i] = self.shuffle_i[swap];
      self.shuffle_i[swap] = val;
    }
  }

  self.flow = function(from, to)
  {
    var d = from.nutrition-to.nutrition;
    from.nutrition -= d*0.0001;
    to.nutrition   += d*0.0001;
  }

  self.hover = function(evt)
  {
    worldSpaceDoEvt(gg.cam, gg.canv, evt);
    self.hover_t = self.tiles_wt(evt.wx,evt.wy);

    var hovered;
    for(var i = 0; i < gg.farmbits.length; i++) { var b = gg.farmbits[i]; if(ptWithinBox(b,evt.doX,evt.doY)) hovered = b; }
    if(hovered)
    {
      gg.inspector.quick = hovered;
      gg.inspector.quick_type = INSPECTOR_CONTENT_FARMBIT;
    }
    if(!hovered)
    {
      for(var i = 0; i < gg.items.length; i++) { var it = gg.items[i]; if(ptWithinBox(it,evt.doX,evt.doY)) hovered = it; }
      if(hovered)
      {
        gg.inspector.quick = hovered;
        gg.inspector.quick_type = INSPECTOR_CONTENT_ITEM;
      }
      else
      {
        gg.inspector.quick = self.hover_t;
        gg.inspector.quick_type = INSPECTOR_CONTENT_TILE;
      }
    }
  }
  self.unhover = function(evt)
  {
    self.hover_t = 0;
    gg.inspector.tile_quick = 0;
    gg.inspector.quick_type = INSPECTOR_CONTENT_NULL;
  }

  self.click = function(evt)
  {
    if(gg.palette.palette == PALETTE_PROD)
    {
      var clicked;
      for(var i = 0; i < gg.farmbits.length; i++) { var b = gg.farmbits[i]; if(ptWithinBox(b,evt.doX,evt.doY)) clicked = b; }
      if(clicked)
      {
        gg.inspector.detailed = clicked;
        gg.inspector.detailed_type = INSPECTOR_CONTENT_FARMBIT;
      }
      if(!clicked)
      {
        for(var i = 0; i < gg.items.length; i++) { var it = gg.items[i]; if(ptWithinBox(it,evt.doX,evt.doY)) clicked = it; }
        if(clicked)
        {
          gg.inspector.detailed = clicked;
          gg.inspector.detailed_type = INSPECTOR_CONTENT_ITEM;
        }
        else
        {
          gg.inspector.detailed = self.hover_t;
          gg.inspector.detailed_type = INSPECTOR_CONTENT_TILE;
        }
      }
      if(!self.hover_t) return;
    }

    if(gg.palette.palette == PALETTE_BIT)
    {
      var b = new farmbit();
      b.tile = self.hover_t;
      gg.b.tiles_tw(self.hover_t,b);
      gg.farmbits.push(b);
      job_for_b(b);
    }

    if(gg.palette.palette == PALETTE_FARM && self.hover_t.type != TILE_TYPE_FARM)
    {
      self.hover_t.type = TILE_TYPE_FARM;
      self.hover_t.state = TILE_STATE_FARM_UNPLANTED;
      self.hover_t.state_t = 0;
      self.hover_t.val = 0;
      b_for_job(JOB_TYPE_PLANT, self.hover_t, 0);
    }
    if(gg.palette.palette == PALETTE_LIVESTOCK && self.hover_t.type != TILE_TYPE_LIVESTOCK)
    {
      self.hover_t.type = TILE_TYPE_LIVESTOCK;
      self.hover_t.state = TILE_STATE_LIVESTOCK_IDLE;
      self.hover_t.state_t = 0;
      self.hover_t.val = 1; //fullness
    }
    if(gg.palette.palette == PALETTE_STORAGE && self.hover_t.type != TILE_TYPE_STORAGE)
    {
      self.hover_t.type = TILE_TYPE_STORAGE;
      self.hover_t.state = TILE_STATE_STORAGE_UNASSIGNED;
      self.hover_t.state_t = 0;
      self.hover_t.val = 0;
    }
  }

  self.tick = function()
  {
    var n = self.tw*self.th;
    for(var i = 0; i < n; i++)
    {
      var t = self.tiles[i];
      t.state_t++;
      switch(t.type)
      {
        case TILE_TYPE_FARM:
        {
          if(t.state == TILE_STATE_FARM_PLANTED)
          {
            var d = min(t.nutrition*farm_nutrition_uptake_p,farm_nutrition_uptake_max);
            t.val += d;
            t.nutrition -= d;
            if(t.val > farm_nutrition_req)
            {
              t.state = TILE_STATE_FARM_GROWN;
              t.val = 0;
              t.state_t = 0;
              b_for_job(JOB_TYPE_HARVEST, t, 0);
            }
          }
        }
          break;
        case TILE_TYPE_LIVESTOCK:
        {
          t.val *= 0.999;
          if(t.state == TILE_STATE_LIVESTOCK_IDLE && t.state_t > livestock_poop_t)
          {
            t.state = TILE_STATE_LIVESTOCK_IDLE;
            t.state_t = 0;

            //gen poop
            var it = new item();
            it.type = ITEM_TYPE_POOP;
            it.carryability = poop_carryability;
            it.tile = t;
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);

            if(!b_for_job(JOB_TYPE_FERTILIZE, 0, it)) b_for_job(JOB_TYPE_STORE, 0, it);
          }
        }
          break;
      }
      var right = self.tiles_t(t.tx+1,t.ty  );
      var top   = self.tiles_t(t.tx  ,t.ty+1);
      self.flow(t,right);
      self.flow(t,top);
    }
  }

  self.draw = function()
  {
    var w = self.w/self.tw;
    var h = self.h/self.th;
    var i = 0;
    for(var ty = 0; ty < self.th; ty++)
    {
      for(var tx = 0; tx < self.tw; tx++)
      {
        var t = self.tiles[i];
        switch(t.type)
        {
          case TILE_TYPE_LAND:  gg.ctx.fillStyle = "rgba(255,"+(255-floor(t.nutrition*255))+",255,1)"; break;
          case TILE_TYPE_WATER: gg.ctx.fillStyle = "rgba("+floor(t.nutrition*255)+",255,255,1)"; break;
          case TILE_TYPE_SHORE: gg.ctx.fillStyle = "rgba("+floor((t.nutrition/2+0.5)*255)+",255,255,1)"; break;
          case TILE_TYPE_FARM:
          {
            switch(t.state)
            {
              case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillStyle = brown; break;
              case TILE_STATE_FARM_PLANTED:   gg.ctx.fillStyle = "rgba(255,"+floor(t.val/farm_nutrition_req*255)+",0,1)"; break;
              case TILE_STATE_FARM_GROWN:     gg.ctx.fillStyle = green; break;
            }
          }
            break;
          case TILE_TYPE_LIVESTOCK: gg.ctx.fillStyle = blue;   break;
          case TILE_TYPE_STORAGE:   gg.ctx.fillStyle = purple; break;
        }
        gg.ctx.fillRect(self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
        i++;
      }
    }
    var t;
    if(gg.inspector.detailed_type == INSPECTOR_CONTENT_TILE) { t = gg.inspector.detailed; gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }
    if(gg.inspector.quick_type    == INSPECTOR_CONTENT_TILE) { t = gg.inspector.quick;    gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }
  }
}

var item = function()
{
  var self = this;
  self.thing = THING_TYPE_ITEM;

  self.wx = 0;
  self.wy = 0;
  self.ww = 20;
  self.wh = 20;
  self.wz = 0;
  self.wvx = 0;
  self.wvy = 0;
  self.wvz = 0;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.tile;
  self.type = ITEM_TYPE_NULL;
  self.state = ITEM_STATE_NULL;
  self.carryability = 1;
  self.lock = 0;

  self.tick = function()
  {
    self.wvz -= 0.1;
    self.wx += self.wvx;
    self.wy += self.wvy;
    self.wz += self.wvz;
    gg.b.wrapw(self);
    if(self.wz < 0) { self.wz = 0; self.wvz *= -1; }
    self.wvx *= 0.95;
    self.wvy *= 0.95
    self.wvz *= 0.95
    if(abs(self.wvx) < 0.01) self.wvx = 0;
    if(abs(self.wvy) < 0.01) self.wvy = 0;
    if(self.wz < 0.01 && abs(self.wvz) < 0.1) { self.wvz = 0; self.wz = 0; }

    self.tile = gg.b.tiles_wt(self.wx,self.wy);
  }

  self.draw = function()
  {
    gg.ctx.fillStyle = blue;
    fillBox(self,gg.ctx);
  }
}

var farmbit_imgs = [];
var farmbit = function()
{
  var self = this;
  self.thing = THING_TYPE_FARMBIT;

  self.wx = 0;
  self.wy = 0;
  self.ww = 20;
  self.wh = 20;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.walk_speed = 1; //MUST BE < tile_w
  self.move_dir_x = 0.;
  self.move_dir_y = 0.;

  self.job_type = JOB_TYPE_IDLE;
  self.job_subject = 0;
  self.job_object = 0;
  self.job_state = JOB_STATE_IDLE_CHILL;
  self.job_state_t = 0;
  self.item = 0;
  self.tile;

  self.fullness    = 1;
  self.energy      = 1;
  self.joy         = 1;
  self.fulfillment = 1;
  self.fullness_state    = FARMBIT_STATE_CONTENT;
  self.energy_state      = FARMBIT_STATE_CONTENT;
  self.joy_state         = FARMBIT_STATE_CONTENT;
  self.fulfillment_state = FARMBIT_STATE_CONTENT;

  self.frame_i = 0;
  self.frame_l = 10;
  self.frame_t = randIntBelow(self.frame_l);

  if(!farmbit_imgs.length)
  {
    var ctx;
    var s = 10;
    var i = 0;
    //idle
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //shrug
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //walk- fat arms
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    i++

    //walk- fat legs
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //idle- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //shrug- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat arms- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat legs- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //idle- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //shrug- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //walk- fat arms- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    i++

    //walk- fat legs- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //idle- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //shrug- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat arms- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat legs- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++
  }

  self.walk_toward_tile = function(t)
  {
    self.move_dir_x = t.tx-self.tile.tx;
    self.move_dir_y = t.ty-self.tile.ty;
    var l = sqrt(self.move_dir_x*self.move_dir_x+self.move_dir_y*self.move_dir_y);
    if(l != 0)
    {
      self.move_dir_x /= l;
      self.move_dir_y /= l;
    }

    var carry = 1;
    if(self.item) carry = self.item.carryability;
    self.wx += self.move_dir_x*self.walk_speed*carry;
    self.wy += self.move_dir_y*self.walk_speed*carry;
  }

  self.walk_toward_item = function(it)
  {
    var t = it.tile;
    self.walk_toward_tile(t);
  }

  self.calibrate_stats = function()
  {
         if(self.fullness > fullness_content)   self.fullness_state = FARMBIT_STATE_CONTENT;
    else if(self.fullness > fullness_motivated) self.fullness_state = FARMBIT_STATE_MOTIVATED;
    else                                        self.fullness_state = FARMBIT_STATE_DESPERATE;

         if(self.energy > energy_content)   self.energy_state = FARMBIT_STATE_CONTENT;
    else if(self.energy > energy_motivated) self.energy_state = FARMBIT_STATE_MOTIVATED;
    else                                    self.energy_state = FARMBIT_STATE_DESPERATE;

         if(self.joy > joy_content)   self.joy_state = FARMBIT_STATE_CONTENT;
    else if(self.joy > joy_motivated) self.joy_state = FARMBIT_STATE_MOTIVATED;
    else                              self.joy_state = FARMBIT_STATE_DESPERATE;

         if(self.fulfillment > fulfillment_content)   self.fulfillment_state = FARMBIT_STATE_CONTENT;
    else if(self.fulfillment > fulfillment_motivated) self.fulfillment_state = FARMBIT_STATE_MOTIVATED;
    else                                              self.fulfillment_state = FARMBIT_STATE_DESPERATE;
  }

  self.go_idle = function()
  {
    self.job_type = JOB_TYPE_IDLE;
    self.job_subject = 0;
    self.job_object = 0;
    self.job_state = JOB_STATE_IDLE_CHILL;
    self.job_state_t = 0;
  }

  self.tick = function()
  {
    self.frame_t++;
    if(self.frame_t > self.frame_l)
    {
      self.frame_i = (self.frame_i+1)%2;
      self.frame_t = 0;
    }

    self.fullness    *= 0.999;
    self.energy      *= 0.999;
    self.joy         *= 0.999;
    self.fulfillment *= 0.999;

    var dirty = false;
    switch(self.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fullness < fullness_content)   { self.fullness_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fullness < fullness_motivated) { self.fullness_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.energy < energy_content)   { self.energy_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.energy < energy_motivated) { self.energy_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.joy < joy_content)   { self.joy_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.joy < joy_motivated) { self.joy_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fulfillment < fulfillment_content)   { self.fulfillment_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fulfillment < fulfillment_motivated) { self.fulfillment_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    if(dirty && self.job_type == JOB_TYPE_IDLE) job_for_b(self);

    self.job_state_t++;
    switch(self.job_type)
    {
      case JOB_TYPE_NULL:
        console.log("GAH!"); //shouldn't get here
        break;
      case JOB_TYPE_IDLE:
      {
        switch(self.job_state)
        {
          case JOB_STATE_IDLE_CHILL:
          {
            if(rand() < 0.01)
            {
              self.job_state = JOB_STATE_IDLE_WANDER;
              self.job_state_t = 0;
              var theta = rand()*twopi;
              self.move_dir_x = cos(theta);
              self.move_dir_y = sin(theta);
            }
          }
            break;
          case JOB_STATE_IDLE_WANDER:
          {
            if(rand() < 0.01)
            {
              self.job_state = JOB_STATE_IDLE_CHILL;
              self.job_state_t = 0;
            }
            var carry = 1;
            if(self.item) carry = self.item.carryability;
            self.wx += self.move_dir_x*self.walk_speed*carry;
            self.wy += self.move_dir_y*self.walk_speed*carry;
            gg.b.wrapw(self);
          }
        }
      }
        break;
      case JOB_TYPE_WAIT:
      {
        if(self.job_state_t > wait_t)
        {
          self.go_idle();
          job_for_b(self);
        }
      }
        break;
      case JOB_TYPE_EAT:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
            var o = self.job_object;
            var t = self.job_object.tile;

            if(o.thing == THING_TYPE_ITEM)
            {
              if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                self.walk_toward_tile(t);
              else
              {
                self.item = o;
                self.job_state = JOB_STATE_ACT;
                self.job_state_t = 0;
              }
            }
            else if(self.job_object.thing == THING_TYPE_TILE)
            {
              if(self.tile != t)
                self.walk_toward_tile(t);
              else
              {
                t.withdraw_lock--;
                t.val--;
                if(t.val == 0 && t.deposit_lock == 0) t.state = TILE_STATE_STORAGE_UNASSIGNED;

                //pop item out of storage
                var it = new item();
                it.type = ITEM_TYPE_FOOD;
                it.carryability = food_carryability;
                it.tile = t;
                gg.b.tiles_tw(it.tile,it);
                kick_item(it);
                gg.items.push(it);
                it.lock = 1;

                self.job_object = it;
                self.job_state = JOB_STATE_GET;
                self.job_state_t = 0;
              }
            }
            break;
          case JOB_STATE_ACT:
            break_item(self.item);
            self.item = 0;
            self.fullness = 1;
            self.fullness_state = FARMBIT_STATE_CONTENT;
            self.go_idle();
            job_for_b(self);
            break;
        }
      }
        break;
      case JOB_TYPE_SLEEP:
      {
        self.job_state = JOB_STATE_ACT;
        self.energy += 0.01;
        if(self.energy > 1)
        {
          self.energy = 1;
          self.energy_state = FARMBIT_STATE_CONTENT;
          self.go_idle();
          job_for_b(self);
        }
      }
        break;
      case JOB_TYPE_PLAY:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
              self.job_state = JOB_STATE_ACT;
          }
            break;
          case JOB_STATE_ACT:
          {
            self.joy += 0.02;
            if(self.joy > 1)
            {
              self.joy = 1;
              self.joy_state = FARMBIT_STATE_CONTENT;
              self.go_idle();
              job_for_b(self);
            }
          }
            break;
        }
      }
        break;
      case JOB_TYPE_PLANT:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
              self.job_state = JOB_STATE_ACT;
          }
            break;
          case JOB_STATE_ACT:
          {
            var t = self.job_subject;
            t.state = TILE_STATE_FARM_PLANTED;
            t.state_t = 0;
            t.lock = 0;
            self.fulfillment += harvest_fulfillment;
            self.calibrate_stats();
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
          break;
      case JOB_TYPE_HARVEST:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
              self.job_state = JOB_STATE_ACT;
          }
            break;
          case JOB_STATE_ACT:
          {
            var t = self.job_subject;
            t.state = TILE_STATE_FARM_UNPLANTED;
            t.state_t = 0;
            t.lock = 0;

            //gen food
            var it = new item();
            it.type = ITEM_TYPE_FOOD;
            it.carryability = food_carryability;
            it.tile = t;
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);

            self.fulfillment += harvest_fulfillment;
            self.calibrate_stats();
            self.go_idle();

            if(!b_for_job(JOB_TYPE_EAT, 0, it)) b_for_job(JOB_TYPE_STORE, 0, it);
            b_for_job(JOB_TYPE_PLANT, t, 0);
            if(self.job_type == JOB_TYPE_IDLE) job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_FEED:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var o = self.job_object;
            var t = self.job_object.tile;

            if(o.thing == THING_TYPE_ITEM)
            {
              if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                self.walk_toward_tile(t);
              else
              {
                self.item = o;
                self.job_state = JOB_STATE_SEEK;
                self.job_state_t = 0;
              }
            }
            else if(self.job_object.thing == THING_TYPE_TILE)
            {
              if(self.tile != t)
                self.walk_toward_tile(t);
              else
              {
                t.withdraw_lock--;
                t.val--;
                if(t.val == 0 && t.deposit_lock == 0) t.state = TILE_STATE_STORAGE_UNASSIGNED;

                //pop item out of storage
                var it = new item();
                it.type = ITEM_TYPE_FOOD;
                it.carryability = food_carryability;
                it.tile = t;
                gg.b.tiles_tw(it.tile,it);
                kick_item(it);
                gg.items.push(it);
                it.lock = 1;

                self.job_object = it;
                self.job_state = JOB_STATE_GET;
                self.job_state_t = 0;
              }
            }
          }
            break;
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            self.item.wvx += (self.wx-self.item.wx)*0.01;
            self.item.wvy += (self.wy-self.item.wy)*0.01;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
              self.job_state = JOB_STATE_ACT;
          }
            break;
          case JOB_STATE_ACT:
          {
            var t = self.job_subject;

            break_item(self.item);
            self.item = 0;

            t.val += livestock_food_val;
            t.lock = 0;

            self.fulfillment = 1;
            self.fulfillment_state = FARMBIT_STATE_CONTENT;
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_FERTILIZE:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var o = self.job_object;
            var t = self.job_object.tile;

            if(o.thing == THING_TYPE_ITEM)
            {
              if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                self.walk_toward_tile(t);
              else
              {
                self.item = o;
                self.job_state = JOB_STATE_SEEK;
                self.job_state_t = 0;
              }
            }
            else if(self.job_object.thing == THING_TYPE_TILE)
            {
              if(self.tile != t)
                self.walk_toward_tile(t);
              else
              {
                t.withdraw_lock--;
                t.val--;
                if(t.val == 0 && t.deposit_lock == 0) t.state = TILE_STATE_STORAGE_UNASSIGNED;

                //pop item out of storage
                var it = new item();
                it.type = ITEM_TYPE_POOP;
                it.carryability = food_carryability;
                it.tile = t;
                gg.b.tiles_tw(it.tile,it);
                kick_item(it);
                gg.items.push(it);
                it.lock = 1;

                self.job_object = it;
                self.job_state = JOB_STATE_GET;
                self.job_state_t = 0;
              }
            }
          }
            break;
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            self.item.wvx += (self.wx-self.item.wx)*0.01;
            self.item.wvy += (self.wy-self.item.wy)*0.01;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
              self.job_state = JOB_STATE_ACT;
          }
            break;
          case JOB_STATE_ACT:
          {
            var t = self.job_subject;

            break_item(self.item);
            self.item = 0;

            t.nutrition += farm_nutrition_req;
            t.lock = 0;

            self.fulfillment = 1;
            self.fulfillment_state = FARMBIT_STATE_CONTENT;
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_STORE:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var it = self.job_object;
            var t = it.tile;
            if(self.tile != t || abs(it.wvz) > 0.01 || it.wz > 0.01)
              self.walk_toward_item(it);
            else
            {
              self.item = self.job_object;
              self.job_state = JOB_STATE_SEEK;
            }
          }
            break;
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            self.item.wvx += (self.wx-self.item.wx)*0.01;
            self.item.wvy += (self.wy-self.item.wy)*0.01;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
              self.job_state = JOB_STATE_ACT;
          }
            break;
          case JOB_STATE_ACT:
          {
            var t = self.job_subject;

            break_item(self.item);
            self.item = 0;

            t.deposit_lock--;
            t.val++;

            self.fulfillment = 1;
            self.fulfillment_state = FARMBIT_STATE_CONTENT;
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_KICK:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var it = self.job_object;
            var t = it.tile;
            if(self.tile != t || abs(it.wvz) > 0.01 || it.wz > 0.01)
              self.walk_toward_item(it);
            else
            {
              self.item = self.job_object;
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            var it = self.item;
            self.item = 0;
            kick_item(it);
            it.lock = 0;

            self.fulfillment += kick_fulfillment;
            self.calibrate_stats();

            self.go_idle();
            switch(it.type)
            {
              case ITEM_TYPE_FOOD: if(!b_for_job(JOB_TYPE_EAT,       0, it)) b_for_job(JOB_TYPE_STORE, 0, it); break;
              case ITEM_TYPE_POOP: if(!b_for_job(JOB_TYPE_FERTILIZE, 0, it)) b_for_job(JOB_TYPE_STORE, 0, it); break;
            }
            job_for_b(self);
          }
            break;
        }
      }
        break;
      default:
        return;
    }

    self.tile = gg.b.tiles_wt(self.wx,self.wy);
  }

  self.draw = function()
  {
    if(self.job_subject)
    {
      if(self.job_subject.thing == THING_TYPE_TILE)
      {
        gg.b.tiles_tw(self.job_subject,self.job_subject);
        screenSpacePt(gg.cam, gg.canv, self.job_subject);
      }
      gg.ctx.strokeStyle = green;
      gg.ctx.beginPath();
      gg.ctx.moveTo(self.x+self.w/2,self.y+self.h/2);
      gg.ctx.lineTo(self.job_subject.x,self.job_subject.y);
      gg.ctx.stroke();
    }
    if(self.job_object)
    {
      if(self.job_object.thing == THING_TYPE_TILE)
      {
        gg.b.tiles_tw(self.job_object,self.job_object);
        screenSpacePt(gg.cam, gg.canv, self.job_object);
      }
      gg.ctx.strokeStyle = green;
      gg.ctx.beginPath();
      gg.ctx.moveTo(self.x+self.w/2,self.y+self.h/2);
      gg.ctx.lineTo(self.job_object.x,self.job_object.y);
      gg.ctx.stroke();
    }

    var w = self.w/4;
    var x = self.x;
    var y = self.y;
    var h = self.h;
    switch(self.fullness_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.fullness,w,h*self.fullness);
    x += w;
    switch(self.energy_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.energy,w,h*self.energy);
    x += w;
    switch(self.joy_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.joy,w,h*self.joy);
    x += w;
    switch(self.fulfillment_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.fulfillment,w,h*self.fulfillment);
    x += w;

    var off = 0;
    if(self.tile.type == TILE_TYPE_WATER || self.tile.type == TILE_TYPE_SHORE) off += 4;
         if(gg.inspector.detailed_type == INSPECTOR_CONTENT_FARMBIT && gg.inspector.detailed == self) off += 8;
    else if(gg.inspector.quick_type    == INSPECTOR_CONTENT_FARMBIT && gg.inspector.quick    == self) off += 8;
    switch(self.job_state)
    {
      case JOB_STATE_ACT:
        gg.ctx.fillStyle = black;
        switch(self.job_type)
        {
          case JOB_TYPE_SLEEP: gg.ctx.fillText("ZZ",self.x,self.y-10); break;
          case JOB_TYPE_PLAY:  gg.ctx.fillText(":)",self.x,self.y-10); break;
        }
        //break; //don't break!
      case JOB_STATE_IDLE_CHILL:
        gg.ctx.drawImage(farmbit_imgs[self.frame_i+off],self.x,self.y,self.w,self.h);
        break;
      case JOB_STATE_GET:
      case JOB_STATE_SEEK:
      case JOB_STATE_IDLE_WANDER:
        gg.ctx.drawImage(farmbit_imgs[self.frame_i+2+off],self.x,self.y,self.w,self.h);
        break;
    }
  }
}

