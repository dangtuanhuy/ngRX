export class ItemNavbar {
    constructor(item?: any) {
        if (!item) { return; }
        this.label = item.label;
        this.url = item.url;
    }

    public label;
    public url;
}
