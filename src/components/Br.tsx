import React from "react";

interface Props {
    count: number;
}

export default function Br({ count }: Props): any {
    return Array.from(Array(count), (_, idx) => <br key={idx} />);
}
