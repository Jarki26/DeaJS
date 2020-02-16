export default class Utils{
    static calc_pos(i, n){
        var x = 0;
        var y = 0;
        var rad = 70*n/Math.PI;
        if(n>1){
            var delta = 2*Math.PI/n;
            if(i<n/2){
                x = Math.round(Math.cos(i*delta) * rad);
                y = Math.round(Math.sin(i*delta) * rad);
            }else{
                x = Math.round(Math.cos(i*delta) * 1.2*rad);
                y = Math.round(Math.sin(i*delta) * 1.2*rad);
            }
        }
        return {"x":x, "y":y};
    }
    
    static gen_arc_key(nodeA, nodeB){
        if(nodeA<nodeB){
            return "".concat(nodeA,";",nodeB);
        } else {
            return "".concat(nodeB,";",nodeA);
        }
    }

    static round_value(num){
        return Math.round(num*100)/100;
    }
    
    static ceil_value(num){
        return Math.ceil(num*100)/100;
    }
    
    static round_vec(vec){
        vec.x = Math.round(vec.x * 10000)/10000;
        vec.y = Math.round(vec.y * 10000)/10000;
        if(vec.x==-0){vec.x=0}
        if(vec.y==-0){vec.y=0}
        return vec;
    }
}