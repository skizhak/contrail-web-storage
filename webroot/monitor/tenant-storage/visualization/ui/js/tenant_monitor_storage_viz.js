var storageRenderer = new storageRenderer();
var ZOOMED_OUT = 0;
var timeout;
var expanded = true;

function storageRenderer() {
    this.load = function(obj) {
        this.vizTemplate = Handlebars.compile($("#storage-visualization-template").html());
        //Handlebars.registerPartial("deviceSummary", $("#device-summary-template").html());
        Handlebars.registerPartial('storageTabsHtml',$('#storage-tabs').html());
        $("#content-container").html('');
        $("#content-container").html(this.vizTemplate);
        this.model = new storageModel({});
        this.view = new storageView(this.model);
        this.controller = new storageController(this.model, this.view);
        this.controller.getModelData();
    }

    this.getModel = function() {
        return this.model;
    }

    this.getView = function() {
        return this.view;
    }

    this.getController = function() {
        return this.controller;
    }

    this.destroy = function() {
        this.getModel().destroy();
        this.getView().destroy();
        this.getController().destroy();
    }
}

/**
 * Ceph Cluster Models
 */

//Storage Disk
var Disk = function() {
    this.identifier = "DISK";
    this.name = "";
    this.id = "";
    this.uuid = "";
    this.host = "";
    this.status = "";
    this.cluster_status = "";
    this.public_addr = "";
    this.kb = "";
    this.kb_avail = "";
    this.kb_used = "";
    this.ceph_crush_name = "default";
    this.reads = "Not Available";
    this.writes = "Not Available";
    this.read_kbytes = "Not Available";
    this.writes_kbytes = "Not Available";
    this.apply_latency = "";
    this.commit_latency = "";
    this.color = "";
}

Disk.prototype.setName = function(name) {
    if(null !== name && typeof name == "string") {
        this.name = name;
    } else {
        this.name = "";
    }
}

Disk.prototype.getName = function() {
    return this.name;
}

Disk.prototype.getIdentifier = function() {
    return this.identifier;
}

Disk.prototype.setId = function(id) {
    if(null !== id && typeof id == "number") {
        this.id = id;
    } else {
        this.name = "";
    }
}

Disk.prototype.getId = function() {
    return this.id;
}

Disk.prototype.setHost = function(host) {
    if(null !== host && typeof host == "string") {
        this.host = host;
    } else {
        this.host = "";
    }
}

Disk.prototype.setPublicAddr = function(addr) {
    if(null !== addr && typeof addr == "string") {
        this.public_addr = addr;
    } else {
        this.public_addr = "";
    }
}

Disk.prototype.getHost = function() {
    return this.host;
}

Disk.prototype.setUUID = function(uuid) {
    if(null !== uuid && typeof uuid == "string") {
        this.uuid = uuid;
    } else {
        this.uuid = "";
    }
}

Disk.prototype.getUUID = function() {
    return this.uuid;
}

Disk.prototype.setStatus = function(status) {
    if(null !== status && typeof status == "string") {
        this.status = status;
    } else {
        this.status = "";
    }
}

Disk.prototype.getStatus = function() {
    return this.status;
}

Disk.prototype.setClusterStatus = function(status) {
    if(null !== status && typeof status == "string") {
        this.cluster_status = status;
    } else {
        this.cluster_status = "";
    }
}

Disk.prototype.getClusterStatus = function() {
    return this.cluster_status;
}

Disk.prototype.setCephCrushName = function(name) {
    if(null !== name && typeof name == "string") {
        this.ceph_crush_name = name;
    } else {
        this.ceph_crush_name = "default";
    }
}

Disk.prototype.setColor = function(color) {
    if(null !== color && typeof color == "string") {
        this.color = color;
    } else {
        this.color = "";
    }
}

Disk.prototype.getColor = function() {
    return this.color;
}

Disk.prototype.setData = function(data) {
    if(null != data && typeof data != "undefined") {
        if(data.name) {
            this.setName(data.name);
        }
        if(data.id) {
            this.setId(data.id);
        }
        if(data.uuid) {
            this.setUUID(data.uuid);
        }
        if(data.host) {
            this.setHost(data.host);
        }
        if(data.public_addr) {
            this.setPublicAddr(data.public_addr);
        }
        if(data.status) {
            this.setStatus(data.status);
        }
        if(data.cluster_status) {
            this.setClusterStatus(data.cluster_status);
        }
        if(typeof data.kb == "number") {
            this.kb = data.kb;
            this.kb_used = data.kb_used;
            this.kb_avail = data.kb_avail;
        }
        if(typeof data.avg_bw == "object") {
            if(data.avg_bw.reads) {
                this.reads = data.avg_bw.reads;
            }
            if(data.avg_bw.writes) {
                this.writes = data.avg_bw.writes;
            }
            if(data.avg_bw.read_kbytes) {
                this.read_kbytes = data.avg_bw.read_kbytes;
            }
            if(data.avg_bw.writes_kbytes) {
                this.writes_kbytes = data.avg_bw.writes_kbytes;
            }
        }
        if(typeof data.fs_perf_stat == "object") {
            this.apply_latency = data.fs_perf_stat.apply_latency_ms;
            this.commit_latency = data.fs_perf_stat.commit_latency_ms;
        }
        if(data.ceph_crush_name) {
            this.setCephCrushName(data.ceph_crush_name);
        }
        if(data.color) {
            this.setColor(data.color);
        }
    }
}

//Storage Monitor
var Monitor = function() {
    this.identifier = "MONITOR";
    this.name = "";
    this.rank = "";
    this.addr = "";
    this.skew = "";
    this.latency = "";
    this.act_health = "";
}

Monitor.prototype.setName = function(name) {
    if(null !== name && typeof name == "string") {
        this.name = name;
    } else {
        this.name = "";
    }
}

Monitor.prototype.getName = function() {
    return this.name;
}

Monitor.prototype.getIdentifier = function() {
    return this.identifier;
}

Monitor.prototype.setRank = function(rank) {
    if(null !== rank && typeof rank == "number") {
        this.rank = rank;
    } else {
        this.rank = "";
    }
}

Monitor.prototype.getRank = function() {
    return this.rank;
}

Monitor.prototype.setAddr = function(addr) {
    if(null !== addr && typeof addr == "string") {
        this.addr = addr;
    } else {
        this.addr = "";
    }
}

Monitor.prototype.getAddr = function() {
    return this.addr;
}

Monitor.prototype.setSkew = function(skew) {
    if(null !== skew && typeof skew == "string") {
        this.skew = skew;
    } else {
        this.skew = "";
    }
}

Monitor.prototype.getSkew = function() {
    return this.skew;
}

Monitor.prototype.setLatency = function(latency) {
    if(null !== latency && typeof latency == "string") {
        this.latency = latency;
    } else {
        this.latency = "";
    }
}

Monitor.prototype.getLatency = function() {
    return this.latency;
}

Monitor.prototype.setActHealth = function(health) {
    if(null !== health && typeof health == "string") {
        this.act_health = health;
    } else {
        this.act_health = "";
    }
}

Monitor.prototype.getHealth = function() {
    return this.act_health;
}


//Storage Node
var StorageNode = function() {
    this.identifier = "NODE";
    this.name = "";
    this.type = "";
    this.build_info = "";
    this.monitor_enabled = false;
    this.max_disks = 0;
    this.status = "";
    this.color = "";

    this.monitor = {};
    this.disks = [];
}

StorageNode.prototype.setName = function(name) {
    if(null !== name && typeof name == "string") {
        this.name = name;
    } else {
        this.name = "";
    }
}

StorageNode.prototype.getName = function() {
    return this.name;
}

StorageNode.prototype.getIdentifier = function() {
    return this.identifier;
}

StorageNode.prototype.setType = function(type) {
    if(null !== type && typeof type == "string") {
        this.type = type;
    } else {
        this.type = "";
    }
}

StorageNode.prototype.getType = function() {
    return this.type;
}

StorageNode.prototype.setBuildInfo = function(build) {
    if(null !== build && typeof build == "string") {
        var versionArr = build.split(" ");
        this.build_info = versionArr[0] + " " + versionArr[2];
    } else {
        this.build_info = "NA";
    }
}

StorageNode.prototype.getBuildInfo = function() {
    return this.build_info;
}

StorageNode.prototype.enableMonitor = function() {
    this.monitor_enabled = true;
}

StorageNode.prototype.disableMonitor = function() {
    this.monitor_enabled = false;
}

StorageNode.prototype.isMonitorEnabled = function() {
    return this.monitor_enabled;
}

StorageNode.prototype.setMaxDisks = function(maxDisks) {
    if(null !== maxDisks && typeof maxDisks !== "undefined") {
        if(typeof maxDisks === "number") {
            this.max_disks = maxDisks;
        } else {
            try {
                this.max_disks = parseInt(maxDisks);
            } catch(e) {
                this.max_disks = 0;
            }
        }
    } else {
        this.max_disks = 0;
    }
}

StorageNode.prototype.getMaxDisks = function() {
    return this.max_disks;
}

StorageNode.prototype.setDisks = function(disks) {
    if(null !== disks && typeof disks !== "undefined" &&
        typeof disks === "object" && disks.length > 0) {
        this.disks = disks;
    } else {
        this.disks = [];
    }
}

StorageNode.prototype.getDisks = function() {
    return this.disks;
}

StorageNode.prototype.setStatus = function(status) {
    if(null !== status && typeof status == "string") {
        this.status = status;
    } else {
        this.status = "";
    }
}

StorageNode.prototype.getStatus = function() {
    return this.status;
}

StorageNode.prototype.setColor = function(color) {
    if(null !== color && typeof color == "string") {
        this.color = color;
    } else {
        this.color = "";
    }
}

StorageNode.prototype.getColor = function() {
    return this.color;
}

StorageNode.prototype.setData = function(data) {
    if (null !== data && typeof data !== "undefined") {
        if (data.name) {
            this.setName(data.name);
        }
        if (data.type) {
            this.setType(data.type);
        }
        if (data.build_info) {
            this.setBuildInfo(data.build_info);
        }
        if (data.monitor_enabled) {
            this.monitor_enabled = data.monitor_enabled;
            this.monitor = new Monitor();
            this.monitor.setName(data.monitor.name);
            this.monitor.setRank(data.monitor.rank);
            this.monitor.setAddr(data.monitor.addr);
            if (data.monitor.skew) {
                this.monitor.setSkew(data.monitor.skew);
            }
            if (data.monitor.latency) {
                this.monitor.setLatency(data.monitor.latency);
            }
            if (data.monitor.act_health) {
                this.monitor.setActHealth(data.monitor.act_health);
            }
        }
        if (data.max_disks) {
            this.setMaxDisks(data.max_disks);
        }
        if (data.osds && typeof data.osds == "object" && data.osds.length > 0) {
            var disks = [];
            $.each(data.osds, function(idx, disk) {
                var tmpDisk = new Disk();
                tmpDisk.setData(disk);
                disks.push(tmpDisk);
            });
        }
        this.setMaxDisks(disks.length);
        if (disks.length > 0) {
            this.setDisks(disks);
        }
        if (data.status) {
            this.setStatus(data.status);
        }
        if (data.color) {
            this.setColor(data.color);
        }
    }
}

//Storage Chassis
var StorageChassis = function() {
    this.identifier = "CHASSIS";
    this.name = "";
    this.id = "";
    this.storage_nodes = [];
}

StorageChassis.prototype.setName = function(name) {
    if(null !== name && typeof name == "string") {
        this.name = name;
    } else {
        this.name = "";
    }
}

StorageChassis.prototype.getName = function() {
    return this.name;
}

StorageChassis.prototype.getIdentifier = function() {
    return this.identifier;
}

StorageChassis.prototype.setId = function(id) {
    if(null !== id && typeof id == "string") {
        this.id = id;
    } else {
        this.id = "";
    }
}

StorageChassis.prototype.getId = function() {
    return this.id;
}

StorageChassis.prototype.setStorageNodes = function(storage_nodes) {
    if(null !== storage_nodes && typeof storage_nodes !== "undefined" &&
        typeof storage_nodes === "object" && storage_nodes.length > 0) {
        this.storage_nodes = storage_nodes;
    } else {
        this.storage_nodes = [];
    }
}

StorageChassis.prototype.getStorageNodes = function() {
    return this.storage_nodes;
}

StorageChassis.prototype.processData = function(data) {
    if(null !== data && data.hasOwnProperty('hosts') &&
        null === data.hosts || typeof data.hosts === "undefined" ||
        false === data.hosts || data.hosts.length <= 0) {
        return;
    }
    var nodes = [];
    var links = [];
    for(var i=0; i<data.hosts.length; i++) {
        var tmpHostData = data.hosts[i];
        var tmpStorageNode = new StorageNode();
        tmpStorageNode.setData(tmpHostData);
        nodes.push(tmpStorageNode);
    }
    if(nodes.length>0) {
        this.setStorageNodes(nodes);
    }
}

//Storage Cluster
var StorageCluster = function() {
    this.identifier = "CLUSTER";
    this.name = "";
    this.type = "";

    this.max_storage_nodes = 0;
    this.max_up_nodes = 0;
    this.max_down_nodes = 0;
    this.max_warn_nodes = 0;

    this.storage_nodes = [];
}

StorageCluster.prototype.setName = function(name) {
    if(null !== name && typeof name == "string") {
        this.name = name;
    } else {
        this.name = "";
    }
}

StorageCluster.prototype.getName = function() {
    return this.name;
}

StorageCluster.prototype.getIdentifier = function() {
    return this.identifier;
}

StorageCluster.prototype.setType = function(type) {
    if(null !== type && typeof type == "string") {
        this.type = type;
    } else {
        this.type = "";
    }
}

StorageCluster.prototype.getType = function() {
    return this.type;
}

StorageCluster.prototype.setMaxStorageNodes = function(maxNodes) {
    if(null !== maxNodes && typeof maxNodes !== "undefined") {
        if(typeof maxNodes === "number") {
            this.max_storage_nodes = maxNodes;
        } else {
            try {
                this.max_storage_nodes = parseInt(maxNodes);
            } catch(e) {
                this.max_storage_nodes = 0;
            }
        }
    } else {
        this.max_storage_nodes = 0;
    }
}

StorageCluster.prototype.setMaxUpNodes = function(maxNodes) {
    if(null !== maxNodes && typeof maxNodes !== "undefined") {
        if(typeof maxNodes === "number") {
            this.max_up_nodes = maxNodes;
        } else {
            try {
                this.max_up_nodes = parseInt(maxNodes);
            } catch(e) {
                this.max_up_nodes = 0;
            }
        }
    } else {
        this.max_up_nodes = 0;
    }
}

StorageCluster.prototype.setMaxDownNodes = function(maxNodes) {
    if(null !== maxNodes && typeof maxNodes !== "undefined") {
        if(typeof maxNodes === "number") {
            this.max_down_nodes = maxNodes;
        } else {
            try {
                this.max_down_nodes = parseInt(maxNodes);
            } catch(e) {
                this.max_down_nodes = 0;
            }
        }
    } else {
        this.max_down_nodes = 0;
    }
}

StorageCluster.prototype.setMaxWarnNodes = function(maxNodes) {
    if(null !== maxNodes && typeof maxNodes !== "undefined") {
        if(typeof maxNodes === "number") {
            this.max_warn_nodes = maxNodes;
        } else {
            try {
                this.max_warn_nodes = parseInt(maxNodes);
            } catch(e) {
                this.max_warn_nodes = 0;
            }
        }
    } else {
        this.max_warn_nodes = 0;
    }
}

StorageCluster.prototype.setStorageNodes = function(storage_nodes) {
    if(null !== storage_nodes && typeof storage_nodes !== "undefined" &&
        typeof storage_nodes === "object" && storage_nodes.length > 0) {
        this.storage_nodes = storage_nodes;
    } else {
        this.storage_nodes = [];
    }
}

StorageCluster.prototype.getStorageNodes = function() {
    return this.storage_nodes;
}

StorageCluster.prototype.processData = function(data) {
    if(data.name) {
        this.setName(data.name);
    }
    if(data.type) {
        this.setType(data.type);
    }
    if(data.total_node) {
        this.setMaxStorageNodes(data.total_node);
    }
    if(data.total_up_node) {
        this.setMaxUpNodes(data.total_up_node);
    }
    if(data.total_down_node) {
        this.setMaxDownNodes(data.total_down_node);
    }
    if(data.total_warn_node) {
        this.setMaxWarnNodes(data.total_warn_node);
    }
    if(null !== data && data.hasOwnProperty('hosts') &&
        null === data.hosts || typeof data.hosts === "undefined" ||
        false === data.hosts || data.hosts.length <= 0) {
        return;
    }
    var nodes = [];
    var links = [];
    for(var i=0; i<data.hosts.length; i++) {
        var tmpHostData = data.hosts[i];
        var tmpStorageNode = new StorageNode();
        tmpStorageNode.setData(tmpHostData);
        nodes.push(tmpStorageNode);
    }
    if(nodes.length>0) {
        this.setStorageNodes(nodes);
    }
}

/**
 * Storage Model
 * A storage Model consist of
 *      1 Storage Cluster (contains all Storage Nodes)
 *      zero or more Storage Chassis (contains Storage Nodes part of particular chassis)
 * @param data
 */
var storageModel = function storageModel(data) {
    this.cluster = {};
    this.chassis_group = [];
    this.processData(data);
}

storageModel.prototype.getComponents = function() {
    var components = [];
    if(null != this.cluster) {
        components.push(this.cluster);
    }
    if(this.chassis_group.length > 0) {
        $.each(this.chassis_group, function(idx, chassis) {
            components.push(chassis);
        });
    }
    if(this.cluster.storage_nodes.length > 0) {
        $.each(this.cluster.storage_nodes, function(idx, node) {
            components.push(node);
        })
    }
    return components;
}

storageModel.prototype.setCluster = function(cluster) {
    if(null !== cluster && typeof cluster !== "undefined" &&
        typeof cluster === "object") {
        this.cluster = cluster;
    } else {
        this.cluster = {};
    }
}

storageModel.prototype.getCluser = function() {
    return this.cluster;
}

storageModel.prototype.getClusterComponents = function() {
    var components = [];
    if(null != this.cluster) {
        components.push(this.cluster);
        if(this.cluster.storage_nodes.length > 0) {
            $.each(this.cluster.storage_nodes, function(idx, node) {
                components.push(node);
            });
        }
    }
    return components;
}

storageModel.prototype.setChassisGroup = function(chassis_group) {
    if(null !== chassis_group && typeof chassis_group !== "undefined" &&
        typeof chassis_group === "object") {
        this.chassis_group = chassis_group;
    } else {
        this.chassis_group = [];
    }
}

storageModel.prototype.getChassisGroup = function() {
    return this.chassis_group;
}

storageModel.prototype.getData = function(cfg) {
    var url = cfg.url;
    var _this = this;
    if(null !== url && "" !== url.trim()) {
        $.ajax({
            dataType: "json",
            url: url,
            type: cfg.type,
            success: function (response) {
                cfg.callback(response);
            },
            failure: function (err) {
                if(cfg.failureCallback != null && typeof cfg.failureCallback == 'function')
                    cfg.failureCallback(err);
            }
        });
    }
}

storageModel.prototype.processData = function(data) {
    var topology_data = [],
        _this = this;
    if(null !== data && typeof data !== "undefined" && data.length > 0) {
        topology_data = data;
    }
    var chassis = [];
    $.each(topology_data, function(idx, topology) {
        if(topology.type == "root") {
            var tmpClusterData = new StorageCluster();
            var osdColorArr = [],
                osdStatusArr = [],
                hostColorArr = [],
                hostStatusArr = [];

            $.each(topology.hosts, function(idx, tmpHostData) {
                $.each(tmpHostData.osds, function(idx, osd) {
                    osd.color = getOSDColor(osd);
                    osdColorArr.push(osd.color);
                    osdStatusArr.push(osd.status);
                    osdStatusArr.push(osd.cluster_status);
                });
                tmpHostData.color = getHostColor(osdColorArr);
                hostColorArr = tmpHostData.color;
                tmpHostData.status = getHostStatus(osdStatusArr);
                hostStatusArr = tmpHostData.status;
            });
            topology.color = getHostColor(hostColorArr);
            topology.status = getHostStatus(hostStatusArr);
            tmpClusterData.processData(topology);
            _this.setCluster(tmpClusterData);
        } else {
            var tmpChassisData = new StorageChassis();
            tmpChassisData.processData(topology);
            chassis.push(tmpChassisData);
        }
    });
    if(chassis.length > 0) {
        this.setChassisGroup(chassis);
    }
}

storageModel.prototype.reset = function() {
    this.cluster = {};
    this.chassis_group = [];
}

storageModel.prototype.destroy = function() {
    this.reset();
}

/**
 * Storage View
 * @param model
 */

var storageView = function storageView(model) {
    this.elementMap        = {
        nodes: {},
        links: {}
    };
    this.connectedElements = [];
    this.model = model || new storageModel();
    this.graph = new joint.dia.Graph;
    window.onresize = this.resizeTopology;
    var topologySize = this.calculateDimensions(false);
    this.setDimensions(topologySize);
    this.paper  = new joint.dia.Paper({
        el: $("#topology-connected-elements"),
        model: this.graph,
        width: $("#topology-connected-elements").innerWidth(),
        height: $("#topology-connected-elements").innerHeight()//,
        //linkView: joint.shapes.contrail.LinkView
    });
    var myAdjustVertices = _.partial(this.adjustVertices, this.graph);

    // adjust vertices when a cell is removed or its source/target was changed
    this.graph.on('add remove change:source change:target', myAdjustVertices);

    // also when an user stops interacting with an element.
    this.paper.on('cell:pointerup', myAdjustVertices);

    this.initZoomControls();
    this.tooltipConfig = {};
    this.renderStorageTabs();
    this.cluster_selector_element = this.constructBreadcrumbDropdown("storage_cluster");
}

storageView.prototype.getClusterSelectorElement = function() {
    return this.cluster_selector_element;
}

storageView.prototype.calculateDimensions = function(expand) {
    var viewArea = this.getViewArea();
    var viewAreaHeight = viewArea.height;
    var viewAreaWidth = viewArea.width;

    var topologyHeight = (expand === true) ? viewAreaHeight*90/100 : viewAreaHeight*60/100;
    var detailsTabHeight = (expand === true) ? viewAreaHeight*10/100 : viewAreaHeight*40/100;
    return {
        "storage_topology": {
            width: viewAreaWidth,
            height: topologyHeight
        },
        "topology": {
            width: viewAreaWidth*90/100,
            height: topologyHeight
        },
        "topology-connected-elements": {
            width: viewAreaWidth*90/100,
            height: topologyHeight
        },
        "topology-controls": {
            width: viewAreaWidth*10/100,
            height: topologyHeight
        },
        "details_tab": {
            width: viewAreaWidth,
            height: detailsTabHeight
        }
    };
}

storageView.prototype.getViewArea = function() {
    var viewAreaWidth = 980;
    var viewAreaHeight = 725;
    var windowHeight = $(window).height()-100; //less breadcrumb
    var windowWidth = $(window).width();
    if(windowHeight > viewAreaHeight )
        viewAreaHeight = windowHeight;
    if(windowWidth > viewAreaWidth)
        viewAreaWidth = windowWidth - 200; //less menu
    return {"width": viewAreaWidth, "height": viewAreaHeight};
}

storageView.prototype.setDimensions = function(dimObj) {
    var _this = this;
    for(var prop in dimObj) {
        if(dimObj.hasOwnProperty(prop)) {
            $("#" + prop).innerWidth(dimObj[prop].width);
            $("#" + prop).innerHeight(dimObj[prop].height);
        }
    }
}

storageView.prototype.adjustVertices = function(graph, cell) {
    //http://jointjs.com/tutorial/multiple-links-between-elements
    // If the cell is a view, find its model.
    cell = cell.model || cell;

    if (cell instanceof joint.dia.Element) {

        _.chain(graph.getConnectedLinks(cell)).groupBy(function(link) {
            // the key of the group is the model id of the link's source or target, but not our cell id.
            return _.omit([link.get('source').id, link.get('target').id], cell.id)[0];
        }).each(function(group, key) {
            // If the member of the group has both source and target model adjust vertices.
            if (key !== 'undefined') storageRenderer.getView().adjustVertices(graph, _.first(group));
        });

        return;
    }

    // The cell is a link. Let's find its source and target models.
    var srcId = cell.get('source').id || cell.previous('source').id;
    var trgId = cell.get('target').id || cell.previous('target').id;

    // If one of the ends is not a model, the link has no siblings.
    if (!srcId || !trgId) return;

    var siblings = _.filter(graph.getLinks(), function(sibling) {

        var _srcId = sibling.get('source').id;
        var _trgId = sibling.get('target').id;

        return (_srcId === srcId && _trgId === trgId) || (_srcId === trgId && _trgId === srcId);
    });

    switch (siblings.length) {

        case 0:
            // The link was removed and had no siblings.
            break;

        case 1:
            // There is only one link between the source and target. No vertices needed.
            cell.unset('vertices');
            break;

        default:

            // There is more than one siblings. We need to create vertices.

            // First of all we'll find the middle point of the link.
            var srcCenter = graph.getCell(srcId).getBBox().center();
            var trgCenter = graph.getCell(trgId).getBBox().center();
            var midPoint = g.line(srcCenter, trgCenter).midpoint();

            // Then find the angle it forms.
            var theta = srcCenter.theta(trgCenter);

            // This is the maximum distance between links
            var gap = 10;

            _.each(siblings, function(sibling, index) {

                // We want the offset values to be calculated as follows 0, 20, 20, 40, 40, 60, 60 ..
                var offset = gap * Math.ceil(index / 2);

                // Now we need the vertices to be placed at points which are 'offset' pixels distant
                // from the first link and forms a perpendicular angle to it. And as index goes up
                // alternate left and right.
                //
                //  ^  odd indexes
                //  |
                //  |---->  index 0 line (straight line between a source center and a target center.
                //  |
                //  v  even indexes
                var sign = index % 2 ? 1 : -1;
                var angle = g.toRad(theta + sign * 90);

                // We found the vertex.
                var vertex = g.point.fromPolar(offset, angle, midPoint);

                sibling.set('vertices', [{ x: vertex.x, y: vertex.y }]);
            });
    }
};

storageView.prototype.setConnectedElements = function(cEls) {
    if(null !== cEls && typeof cEls !== "undefined" &&
        cEls.length > 0) {
        this.connectedElements = cEls;
    } else {
        this.connectedElements = [];
    }
}

storageView.prototype.getElementMap = function() {
    return this.elementMap;
}

storageView.prototype.setElementMap = function(elMap) {
    if(null !== elMap && typeof elMap !== "undefined") {
        this.elementMap = elMap;
    } else {
        this.elementMap = [];
    }
}

storageView.prototype.getModel = function() {
    return this.model;
}

storageView.prototype.getGraph = function() {
    return this.graph;
}

storageView.prototype.getPaper = function() {
    return this.paper;
}

storageView.prototype.constructBreadcrumbDropdown = function(breadcrumbDropdownId) {
    var _this = this;
    var breadcrumbElement = $('#breadcrumb'); //TODO - move to constants
    breadcrumbElement.children('li').removeClass('active');
    breadcrumbElement.children('li:last').append('<span class="divider"><i class="icon-angle-right"></i></span>');
    breadcrumbElement.append('<li class="active ' + breadcrumbDropdownId +'"><div id="' + breadcrumbDropdownId + '"></div></li>');

    var domainDropdownElement = $('#' + breadcrumbDropdownId);
    var domainDropdown = domainDropdownElement.contrailDropdown({
        dataTextField: "name",
        dataValueField: "value",
        change: function (e) {
            _this.createElements(e.target.value);
        }
    }).data('contrailDropdown');
    return domainDropdown;
}

storageView.prototype.populateDomainBreadcrumbDropdown = function() {
    var _this = this;
    var data = this.getModel().getComponents();
    var domainDropdownElement = this.getClusterSelectorElement();
    var dropdownData = [];
    for (var i = 0; i < data.length ; i++){
        var jsonData = {};
        var nodeName = data[i].getName();
        jsonData['name'] = nodeName;
        jsonData['value'] = nodeName;
        dropdownData.push(jsonData);
    }
    if (dropdownData.length > 0) {
        domainDropdownElement.setData(dropdownData);
        $("#storage_cluster").trigger('change');
    } else {

    }
}

storageView.prototype.addElementsToGraph = function(selectedNode) {
    
}

storageView.prototype.createElements = function(selectedNode) {
    var graph = this.getGraph();
    graph.clear();
    var paper = this.getPaper();
    //this.renderStorageDetails();
    $("#topology-connected-elements").find("div").remove();
    var model = this.getModel();
    var data = model.getComponents();
    if(null === data || typeof data === "undefined") {
        return;
    }
    if(typeof data === "object" && data.length <= 0) {
        return;
    }

    var nodeEls = [];
    var linkEls = [];
    for(var compCount=0; compCount<data.length; compCount++) {
        var component = data[compCount];
        if(component.identifier === "CLUSTER") {
            var storage_nodes = component.getStorageNodes();
            var cluster = component;
            var cluster_node = this.createNode({
                name: "cluster_" + cluster.name,
                modelData: cluster, parentData: {}
            }, 'storage-cluster', 0, 'cluster');
            nodeEls.push(cluster_node);

            var storageNodeEls = [];
            for(var i=0; i<storage_nodes.length; i++) {
                var storage_node = this.createNode({
                    name: storage_nodes[i].getName(),
                    modelData: storage_nodes[i], parentData: cluster
                }, 'storage-node', i, 'cluster');
                storageNodeEls.push(storage_node);
            }
            nodeEls.push(storageNodeEls);

            var clusterToStorageNodeLinkEls = [];
            for (var i=0; i<storage_nodes.length; i++) {
                var clusterToStorageNodeLinkEl = this.createLink({
                    modelData: {
                        source: storage_nodes[i],
                        target: cluster
                    }}, 'cl-sn', storageNodeEls[i], cluster_node);
                clusterToStorageNodeLinkEls.push(clusterToStorageNodeLinkEl);
            }

            linkEls = linkEls.concat(clusterToStorageNodeLinkEls);

        } else if(component.identifier == "CHASSIS") {

        } else if(component.identifier == "STORAGE NODE") {
            var storageNodeEl = this.createNode({
                name: component.name,
                modelData: component,
                parentData: {}
            }, 'storage-node', 0, 'storage-node');
            nodeEls = nodeEls.concat(storageNodeEl);
            var disks = component.getDisks();
            if(null !== disks && typeof disks === "object" && disks.length > 0) {
                var no_of_disks = disks.length;
                var diskEls = [],
                    diskToStorageNodeLinkEls = [];
                for(var i=0; i<no_of_disks; i++) {
                    var disk = disks[i];
                    var diskEl = this.createNode({
                        name: disk.name,
                        modelData: disk,
                        parentData: component
                    }, 'disk', i, 'storage-node');
                    diskEls.push(diskEl);
                }
                nodeEls = nodeEls.concat(diskEls);
                for (var i=0; i<no_of_disks; i++) {
                    var diskToStorageNodeLinkEl = this.createLink({
                        modelData: {
                            source: diskEls[i].attributes.nodeDetails.modelData,
                            target: storageNodeEl
                        }}, 'disk-sn', diskEls[i], storageNodeEl);
                    diskToStorageNodeLinkEls.push(diskToStorageNodeLinkEl);
                }
                linkEls = linkEls.concat(diskToStorageNodeLinkEls);
            }
        }
    }
    var allEls = nodeEls.concat(linkEls);
    graph.addCells(allEls);
}

storageView.prototype.createLink = function(link, link_type, source, target) {
    var options;
    var linkElement;
    link1 = {}
    var stroke = '#222';
    options = {
        direction   : "bi",
        linkType    : link.link_type,
        linkDetails : link
    };
    var modelData = source.attributes.nodeDetails.modelData;
    console.log(modelData);
    if(modelData.identifier == "NODE" || modelData.identifier == "DISK") {
        stroke = modelData.color;
    }

    options['sourceId'] = source.id
    options['targetId'] = target.id;
    //linkElement = new ContrailElement('link', options);
    linkElement = new joint.dia.Link({
        source: { id: source.id },
        target: { id: target.id },
        attrs: {
            '.connection': {
                'stroke-width': 1.2,
                stroke: stroke
            },
            '.marker-vertices': {
                display: 'none'
            }
        },
        //smooth: true, // We'are using a bezier curve
        z: -1, // The links are always lying under the elements.,
        linkDetails: {
            source: source,
            target: target
        }
    });
    return linkElement;
}

storageView.prototype.createNode = function(data, type, current_index, view) {
    var nodeType  = type,
        xPos      = 0,
        yPos      = 0,
        width     = 35,
        height    = 36,
        totalBlocks = 0,
        blocksPerRow = 0,
        blocksPerColumn = 0,
        imageLink = "",
        iconClass = "",
        label     = "",
        tableLayout = false;
    if(view === "cluster") {
        if(type === "storage-cluster") {
            totalBlocks = data.modelData.storage_nodes.length;
            blocksPerColumn = Math.ceil(totalBlocks / 2);
        }else {
            totalBlocks = data.parentData.storage_nodes.length;
            blocksPerColumn = Math.ceil(totalBlocks / 2);
        }
        if (totalBlocks > 14) {
            tableLayout = true;
        }
        var perBlockHeight = ($("#topology-connected-elements").height() - 5)/blocksPerColumn;
        height = (perBlockHeight < 36) ? perBlockHeight : 36;
        width = height;

        switch (type) {
            case 'storage-cluster':
                label = "Cluster";
                iconClass = "icon-circle-blank";
                width = 35;
                height = 36;
                xPos = ($("#topology-connected-elements").width() - 35)/2;
                yPos = (tableLayout)? ($("#topology-connected-elements").height() - 36): ($("#topology-connected-elements").height() - 36)/2;
                break;
            case 'storage-chassis':
                label = "Chassis";
                iconClass = "icon-circle-blank";
                width = 35;
                height = 36;
                xPos = ($("#topology-connected-elements").width() - 35)/2;
                yPos = ($("#topology-connected-elements").height() - 36)/2;
                break;
            case 'storage-node':
                iconClass = "icon-th-list";
                label = data.name;
                width = 60;
                height = 50;
                //var xCenter = ($("#topology-connected-elements").width() - 35)/2;
                //var yCenter = ($("#topology-connected-elements").height() - 36)/2;
                //yPos = yCenter + (5 + 5 * current_index * 0.1 * 20) * Math.sin(current_index * 0.1);
                //xPos = xCenter + (5 + 5 * current_index * 0.1 * 20) * Math.cos(current_index * 0.1);
                if (tableLayout) {
                    blocksPerRow = Math.ceil(($("#topology-connected-elements").width() / width) / 2);
                    xPos = Math.ceil(current_index % blocksPerRow) * 2 * width + 10;
                    yPos =  Math.ceil(((current_index == 0)? 1:current_index) / blocksPerRow) * 2 * height + 20;
                    console.log(current_index, blocksPerRow, xPos, yPos);
                } else {
                    yPos = (current_index%blocksPerColumn) * perBlockHeight + 50;
                    xPos = (current_index < blocksPerColumn) ? ((($("#topology-connected-elements").width() - 35)/2) - 100) : ((($("#topology-connected-elements").width() - 35)/2) + 100);
                }
                break;
        }

    } else if(view === "storage-node") {
        if(type === "disk") {
            totalBlocks = data.parentData.disks.length;
            blocksPerRow = Math.ceil(totalBlocks / 2);
            blocksPerColumn = Math.ceil(blocksPerRow / 2);
        }

        var perBlockHeight = ($("#topology-connected-elements").height() - 20)/blocksPerColumn;
        height = (perBlockHeight < 40) ? perBlockHeight : 40;
        width = height;

        var perBlockWidth = ($("#topology-connected-elements").width() - 5)/blocksPerColumn;
        width = (perBlockWidth < 35) ? perBlockWidth : 35;
        height = width;

        switch (type) {
            case 'storage-node':
                iconClass = "icon-th-list";
                label = data.name;
                width = 35;
                height = 36;
                xPos = ($("#topology-connected-elements").width() - 35)/2;
                yPos = ($("#topology-connected-elements").height() - 36)/2;
                break;
            case 'disk':
                iconClass = "icon-hdd";
                label = data.name;
                width = 30;
                height = 36;
                var xCenter = ($("#topology-connected-elements").width() - 35)/2;
                var currX = (((current_index % blocksPerRow) % blocksPerColumn) + 1) * width * 2;
                xPos = ((current_index % blocksPerRow) < blocksPerColumn) ? (xCenter - currX):(xCenter+currX);
                yPos = (current_index < blocksPerRow) ? ((($("#topology-connected-elements").height() - 36)/2) - 100) : ((($("#topology-connected-elements").height() - 36)/2) + 100);
                break;
        }

    } else {

    }

    var options = {
        attrs: {
            text: {
                text: label
            }
        },
        size: {
            width: width,
            height: height
        },
        nodeDetails: data,
        position: {
            x: xPos,
            y: yPos
        },
        font: {
            iconClass: iconClass
        }
    };
    return new ContrailElement(nodeType, options);

}

storageView.prototype.initZoomControls = function() {
    $("#topology-connected-elements").panzoom({
        transition: true,
        duration: 200,
        increment: 0.1,
        minScale: 0.5,
        maxScale: 20,
        contain: false,
        $zoomIn: $("#topology-controls").find(".zoom-in"),
        $zoomOut: $("#topology-controls").find(".zoom-out"),
        $reset: $("#topology-controls").find(".zoom-reset"),
        cursor: "default"
    });
    var _this = this;
    $('#topology-connected-elements').on('mousedown touchstart', function( e ) {
        if(e.target.nodeName == 'svg') {
            $('#topology-connected-elements').panzoom("enable");
        } else{
            $('#topology-connected-elements').panzoom("disable");
        }
    });
    $('#topology-connected-elements').on('mouseup touchend', function( e ) {
        $('#topology-connected-elements').panzoom("enable");
    });
}

storageView.prototype.resetTopology = function() {
    this.renderStorageTabs();
    this.clearHighlightedConnectedElements();
    $("#topology-connected-elements").panzoom("resetZoom");
    $("#topology-connected-elements").panzoom("reset");
    ZOOMED_OUT = 0;
}

storageView.prototype.initTooltipConfig = function() {
    var _this = this;
    this.tooltipConfig = {
        StorageNode: {
            title: function(element, graph) {
                return "Storage Node";
            },
            content: function(element, graph) {
                var viewElement = graph.getCell(element.attr('model-id'));
                var tooltipContent = contrail.getTemplate4Id('tooltip-content-template');
                return tooltipContent([
                    {
                        lbl: "Name",
                        value:  [viewElement.attributes.nodeDetails.modelData.name]
                    },
                    {
                        lbl: "Version",
                        value:  [viewElement.attributes.nodeDetails.modelData.build_info]
                    },
                    {
                        lbl: "Disks",
                        value:  [viewElement.attributes.nodeDetails.modelData.max_disks]
                    },
                    {
                        lbl: "Monitor",
                        value:  [viewElement.attributes.nodeDetails.modelData.monitor_enabled? "Enabled":"Disabled"]
                    }
                ]);
            }
            
        },
        Disk: {
            title: function(element, graph) {
                return "Disk";
            },
            content: function(element, graph) {
                var viewElement = graph.getCell(element.attr('model-id'));
                var tooltipContent = contrail.getTemplate4Id('tooltip-content-template');
                return tooltipContent([
                    {
                        lbl: "Name",
                        value:  [viewElement.attributes.nodeDetails.modelData.name]
                    },
                    {
                        lbl: "Status",
                        value:  [viewElement.attributes.nodeDetails.modelData.status]
                    },
                    {
                        lbl: "Membership",
                        value:  [viewElement.attributes.nodeDetails.modelData.cluster_status]
                    },
                    {
                        lbl: "Usage",
                        value:  [formatBytes(viewElement.attributes.nodeDetails.modelData.kb_used * 1024) +" / " +
                        formatBytes(viewElement.attributes.nodeDetails.modelData.kb * 1024)]
                    }
                ]);

            }
        },
        link: {
            title: function(element, graph) {
                var viewElement = graph.getCell(element.attr('model-id'));
                var endpoint1 = viewElement.attributes.linkDetails.source;
                var endpoint2 = viewElement.attributes.linkDetails.target;
                return "<div class='row-fluid'><div class='span1' style='margin-right:5px'>" + "Link" + "</div>" +
                    "<div class='span5'>" + "source" + "</div>" +
                    "<div class='span5'>" + "target" + "</div></div>";
            },
            content: function(element, graph) {
                var viewElement = graph.getCell(element.attr('model-id'));
                var tooltipContent = contrail.getTemplate4Id('two-column-content-template');
                return tooltipContent([
                    {
                        lbl: "src",
                        value:  [viewElement.attributes.linkDetails.source.attributes.nodeDetails.modelData.name +
                            "(" + viewElement.attributes.linkDetails.source.attributes.nodeDetails.modelData.type + ")"]
                    },
                    {
                        lbl: "trgt",
                        value:  [viewElement.attributes.linkDetails.target.attributes.nodeDetails.modelData.name +
                        "(" + viewElement.attributes.linkDetails.target.attributes.nodeDetails.modelData.type + ")"]
                    }
                ]);
            }
        }
    };
    $.each(this.tooltipConfig, function(keyConfig, valueConfig){
        $('g.' + keyConfig).popover({
            trigger: 'hover',
            html: true,
            delay: { show: 200, hide: 10 },
            title: function(){
                return valueConfig.title($(this), _this.getGraph());
            },
            content: function(){
                return valueConfig.content($(this), _this.getGraph());
            },
            container: $('body')
        });
    });
}

storageView.prototype.addHighlightToNode = function(node_model_id) {
    $('div.font-element[font-element-model-id="' + node_model_id + '"]')
        .addClass('elementHighlighted')
        .removeClass('dimHighlighted')
        .removeClass('hidden');

    $('g.element[model-id="' + node_model_id + '"]')
        .addClassSVG('elementHighlighted')
        .removeClassSVG('dimHighlighted')
        .removeClassSVG('hidden');

    $('div.font-element[font-element-model-id="' + node_model_id + '"]')
        .find('i')
        .css("color", "#498AB9");

}

storageView.prototype.clearHighlightedConnectedElements = function() {
    var g = this.getGraph();

    $('div.font-element')
        .removeClass('elementHighlighted')
        .removeClass('dimHighlighted');
    $('g.element')
        .removeClassSVG('elementHighlighted')
        .removeClassSVG('dimHighlighted');
    $('div.font-element')
        .css('fill', "")
        .css('stroke', "");
    $('div.font-element')
        .find('i')
        .css("color", "#555");
    $('g.element').find('text').css('fill', "#393939");
    $('g.element').find('rect').css('fill', "#393939");

    $('g.link')
        .removeClassSVG('elementHighlighted')
        .removeClassSVG('dimHighlighted');
    $("g.link").find('path.connection')
        .css("stroke", "#393939")
        .css("opacity", "0.6")
    $("g.link").find('path.marker-source')
        .css("fill", "#393939")
        .css("stroke", "#393939");
    $("g.link").find('path.marker-target')
        .css("fill", "#393939")
        .css("stroke", "#393939");
    $("g.link").find('path.connection-wrap')
        .css("opacity", "")
        .css("fill", "")
        .css("stroke", "");
}

storageView.prototype.initGraphEvents = function() {
    var paper = this.getPaper();
    var graph = this.getGraph();
    var selectorId = "#" + paper.el.id;
    var _this      = this;

    paper.on('blank:pointerdblclick', function (evt, x, y) {
        evt.stopImmediatePropagation();
        _this.resetTopology();
    });

    paper.on('cell:pointerdown', function (cellView, evt, x, y) {
        evt.stopImmediatePropagation();
    });

    paper.on('cell:pointerdblclick', function (cellView, evt, x, y) {
        evt.stopImmediatePropagation();
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        var dblClickedElement = cellView.model;
        var elementType = dblClickedElement['attributes']['type'];
        switch(elementType) {
            case 'contrail.StorageNode':
                var nodeDetails = dblClickedElement['attributes']['nodeDetails'];
                var dblClickedElementName = nodeDetails.name;
                var no_of_disks;
                var disks = [], diskEls=[], diskToStorageNodeLinkEls=[];
                var storageNodeEls = [];
                //var storageNodeEl = graph.getCell(dblClickedElement.id);
                //storageNodeEls = storageNodeEls.concat(storageNodeEl);

                if(null !== nodeDetails && typeof nodeDetails === "object") {
                    if(nodeDetails.hasOwnProperty('parentData')) {

                    } else {

                    }
                } else {
                    return;
                }

                if(nodeDetails.hasOwnProperty('modelData')) {
                    var storageNodeEl = _this.createNode({
                        name: nodeDetails.modelData.name,
                        modelData: nodeDetails.modelData,
                        parentData: nodeDetails.parentData //Storage Cluster Data
                    }, 'storage-node', 0, 'storage-node');
                    storageNodeEls = storageNodeEls.concat(storageNodeEl);

                    disks = nodeDetails.modelData.getDisks();
                    if(null !== disks && typeof disks === "object" && disks.length > 0) {
                        no_of_disks = disks.length;

                        for(var i=0; i<no_of_disks; i++) {
                            var disk = disks[i];
                            var diskEl = _this.createNode({
                                name: disk.name,
                                modelData: disk,
                                parentData: nodeDetails.modelData //Storage Node Data
                            }, 'disk', i, 'storage-node');
                            diskEls.push(diskEl);
                        }
                        storageNodeEls = storageNodeEls.concat(diskEls);
                        for (var i=0; i<no_of_disks; i++) {
                            var diskToStorageNodeLinkEl = _this.createLink({
                                modelData: {
                                    source: diskEls[i].attributes.nodeDetails.modelData,
                                    target: storageNodeEl
                                }}, 'disk-sn', diskEls[i], storageNodeEl);
                            diskToStorageNodeLinkEls.push(diskToStorageNodeLinkEl);
                        }
                        storageNodeEls = storageNodeEls.concat(diskToStorageNodeLinkEls);
                    } else {
                        disks = [];
                    }
                } else {
                    return;
                }
                graph.clear();
                $("#topology-connected-elements").find("div").remove();
                graph.addCells(storageNodeEls);
                //joint.layout.contrail.DirectedGraph.layout(graph, {setLinkVertices: false});
                $(".popover").popover().hide();
                break;
        }
    });

    paper.on('cell:pointerclick', function (cellView, evt, x, y) {
        evt.stopImmediatePropagation();
        var clickedElement = cellView.model;
        var elementType    = clickedElement['attributes']['type'];
        if(elementType === "link") {
            //_this.addHighlightToLink(clickedElement.id);
        } else {
            _this.addHighlightToNode(clickedElement.id);
        }

        timeout = setTimeout(function() {
            //trigger 'click' event after 'doubleclick' is initiated.
            var data = {};

            switch(elementType) {
                case 'contrail.StorageNode':
                    var modelData = clickedElement['attributes']['nodeDetails']['modelData'];
                    data['name'] = modelData['name'];
                    data['type'] = 'StorageNode';
                    data['build_info'] = modelData['build_info'];

                    _this.populateDetailsTab(data);
                    break;

            }
        }, 500);
    });
}

storageView.prototype.renderTopology = function() {
    this.populateDomainBreadcrumbDropdown();
    this.renderStorageViz();
}

storageView.prototype.renderStorageViz = function() {
    this.initGraphEvents();
    this.initTooltipConfig();
}

storageView.prototype.addCommonTabs = function(tabDiv) {
    var _this = this;
    var tabObj = $("#"+tabDiv).data('contrailTabs');
    tabObj.addTab('traceFlow','Detail',{position: 'before'});
    tabObj.addTab('flows-tab','Link',{position: 'before'});
    $("#"+tabDiv).on('tabsactivate',function(e,ui){
        var selTab = $(ui.newTab.context).text();
        if(selTab == 'Detail') {

        }
        else if(selTab == 'Link') {

        }
    });
}

storageView.prototype.renderStorageTabs = function() {
    var _this = this;
    $("#storageTabs").html(Handlebars.compile($("#storage-tabs").html()));
    $("#storage_tabstrip").contrailTabs({
        activate:function (e, ui) {
            var selTab = $(ui.newTab.context).text();
            if (selTab == 'Details') {
                _this.renderStorageDetails();
            } else if (selTab == 'Trace Flows') {
            } else if (selTab == 'Details') {
            }
        }
    });
}

storageView.prototype.renderStorageDetails = function(){
    content = {};
    var model = this.getModel();
    var data = model.getComponents();
    content['hostName'] = "127.0.0.1";
    content['type'] = 'Storage Cluster';

    details = Handlebars.compile($("#device-summary-template").html())(content);
    $("#detailsmxTab").html(details);
}

storageView.prototype.populateDetailsTab = function(data) {
    var type = data['type'],details,content = {},_this = this;
    var widget_template = contrail.getTemplate4Id("device-details-widget"),
        details_template = contrail.getTemplate4Id("device-details-body");
    if(type == 'link')
        _this.renderStorageTabs();
    $("#detailsLink").show();
    $("#storage_tabstrip").tabs({active:1});
    if(type != 'link')
        $("#detailsLink").find('a.ui-tabs-anchor').html("Details");

    if (type == 'StorageNode') {
        $("#detailsTab").html(widget_template({
            title: 'Storage Node',
            colCount: 2,
            showSettings: true,
            widgetBoxId: 'deviceDetails'
        }));
        startWidgetLoading('deviceDetails');
        var attrs = [{
            label: 'Name',
            value: data['name']
        }];
        $('#dashboard-box .widget-body').html(details_template({
            attributes: attrs,
            deviceData: data,
            showSettings: true
        }));
        endWidgetLoading('deviceDetails');
        $("#storage_tabstrip").on('tabsactivate', function(e, ui) {
            var selTab = $(ui.newTab.context).text();
        });
    }
}

storageView.prototype.resizeTopology = function() {
    var topologySize = storageRenderer.getView().calculateDimensions(false);
    storageRenderer.getView().setDimensions(topologySize);
}

storageView.prototype.expandTopology = function() {
    var topologySize = this.calculateDimensions(expanded);
    this.setDimensions(topologySize);
    this.getPaper().setDimensions($("#topology-connected-elements").width(), $("#topology-connected-elements").height());
    var graph = this.getGraph();
    var newGraphSize = graph.getBBox(graph.getElements());
    var offset = {
        x: (($("#topology-connected-elements").width() - newGraphSize.width)/2) - newGraphSize.x,
        y: (($("#topology-connected-elements").height() - newGraphSize.height)/2) - newGraphSize.y
    };
    $.each(graph.getElements(), function (elementKey, elementValue) {
        elementValue.translate(offset.x, offset.y);
    });
    expanded = !expanded;
}


storageView.prototype.destroy = function() {
    this.connectedElements = [];
    this.elementMap        = {
        nodes: {},
        links: {}
    };
    var vizTemplate = $("#visualization-template");
    if(isSet(vizTemplate)) {
        vizTemplate.remove();
        vizTemplate = $();
    }
}

/**
 * Storage Controller
 * @param model
 * @param view
 */

var storageController = function storageController(model, view) {
    this.model = model || new storageModel({nodes:[], links:[]});
    this.view  = view  || new new storageView(this.model);

}

storageController.prototype.getModel = function() {
    return this.model;
}

storageController.prototype.getView = function() {
    return this.view;
}

storageController.prototype.getModelData = function(cfg) {
    var _this  = this,url = '/api/tenant/storage/cluster/osds/tree';
    $("#storage_topology").find('.topology-visualization-loading').show();

    var tmpCfg = {
        url      : url,
        type     : "GET",
        callback : function (response) {
            //removing the progress bar
            $("#storage_cluster_topology").find('.topology-visualization-loading').hide();
            topologyCallback(response);
        },
        //Calling the force refresh call on failure of the cache call
        failureCallback : function (err) {
            $("#storage_cluster_topology").find('.topology-visualization-loading').hide();
        }
    };
    function topologyCallback(response){
        if(response != null && response.hasOwnProperty('topology')) {
            var topology = response['topology'];
            globalObj['storageTopology'] = topology;
            _this.getModel().processData(topology);
            _this.getView().renderTopology(topology);
            _this.getView().renderStorageDetails();
        }
    }
    if(null !== cfg && typeof cfg !== "undefined")
        this.getModel().getData(cfg);
    else
        this.getModel().getData(tmpCfg);
}

storageController.prototype.destroy = function() {

}