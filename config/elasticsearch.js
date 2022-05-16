export default {
    // node: 'http://119.3.188.107:9200',
    // node: 'http://192.168.0.110:9201',
    // node: 'http://127.0.0.1:9200',
    node: process.env.NODE_ENV === 'development' ? 'http://119.91.147.28:9200' : 'http://119.91.147.28:9200',
    index: 'goods'
};
