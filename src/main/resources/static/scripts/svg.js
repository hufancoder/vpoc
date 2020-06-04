let gc_config = {
    SurvivorRatio: 8, // survivor:eden = 1:8
    NewRatio: 2 // young:old = 1:2
}
let colors = ["yellow", "red", "pink", "green", "blue"]

let obj_space = {
    width: 80,
    height: 40
}

let new_dot = Snap('#heap').circle(500, 50, 10).attr(
    {
        stroke: "blue",
        "stroke-width": 3,
        fill: "none"
    }
);

let eden_space = {
    width: 800,
    height: 320,

    mark: function (live_obj_id) {
        let obj = Snap(`#obj-${live_obj_id}`);
        obj.select('rect').animate({fill: 'white'}, 3000, mina.bounce);
        Snap.animate(0, 1, function (value) {
            obj.select('text').attr({'font-size': 100, x: 15, y: 35, opacity: value});
        }, 500, mina.bounce);
    },
    copy: function (c) {
        let from = c.from.toLowerCase();
        let to = c.to.toLowerCase();
        let obj_id = c.objectBO.id;
        let address = c.address;
        let offset_x = address * obj_space.width;
        let offset_y = 1;
        let obj = Snap(`#obj-${obj_id}`).clone().attr({id: `obj-${obj_id}`});
        Snap(`#${to}`).add(obj);
        obj.animate({transform: `translate(${offset_x} ${offset_y})`}, 1000, mina.linear);
    },
    sweep: function (s) {
        let space = s.space.toLowerCase();
        Snap(`#${space}`).selectAll('g').remove();
    },
    allocate_one_obj: function (obj) {
        setTimeout(function () {
            new_dot.attr({cx: 500, cy: 80});
            new_dot.animate({cx: 500, cy: 150}, 100, mina.linear);
        }, 10);

        let obj_pointer = obj.address * obj_space.width;
        let x_offset = obj_pointer % eden_space.width;
        let y_offset = Math.floor(obj_pointer / eden_space.width) * obj_space.height;
        let obj_id = obj.id;
        let obj_width = obj.size * obj_space.width;

        let eden = Snap('#eden');
        let obj_g = eden.g().attr({
            id: `obj-${obj_id}`,
            transform: `translate(${x_offset}, ${y_offset})`
        });
        obj_g.rect(0, 0, obj_width, obj_space.height)
            .attr({
                fill: colors[Math.floor(Math.random() * 5)],
                stroke: "gray",
                "stroke-width": 1,
            })
            .addClass("obj_new");
        obj_g.text(obj_width / 2, obj_space.height / 2 + 5, obj_id);
    }
}

let survivor0 = {
    width: eden_space.width / 1,
    height: eden_space.height / 8
}

let survivor1 = {
    width: eden_space.width / 1,
    height: eden_space.height / 8
}

let old = {
    width: eden_space.width,
    height: eden_space.height * gc_config.NewRatio
}

function init_heap() {
    let young = Snap('#young');
    let eden = young.g().attr({id: 'eden', transform: "translate(0 0)"});
    eden.rect(0, 0, eden_space.width, eden_space.height).addClass('eden');

    let s0_g = young.g().attr({id: 's0', transform: `translate(0 ${eden_space.height + 20})`});
    s0_g.rect(0, 0, survivor0.width, survivor0.height).addClass('survivor');
    let s1_g = young.g().attr({id: 's1', transform: `translate(0 ${eden_space.height + 80})`});
    s1_g.rect(0, 0, survivor1.width, survivor1.height).addClass('survivor');

    let old_g = Snap('#old');
    old_g.rect(0, 0, old.width, old.height).addClass('old');
}