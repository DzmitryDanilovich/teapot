interface Tea {
    id: string;
    name: string;
    type: string;
    origin?: string;
}

const teas_stub: Tea[] = [
    { id: "1", name: "Green Tea", type: "Green", origin: "China" },
    { id: "2", name: "Black Tea", type: "Black", origin: "India" },
    { id: "3", name: "Oolong Tea", type: "Oolong", origin: "Taiwan" },
];

export default teas_stub;
