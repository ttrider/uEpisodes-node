interface ISidebarProvider {

    sidebarSections: ISidebarSection[];

    selectedItem?: ISidebarItem;

    selectItem(item?: ISidebarItem): ISidebarProvider;


}

interface ISidebarSection {

    provider?: ISidebarProvider;
    title: string;
    items: ISidebarItem[];
    commandName?: string;
    commandHandler?: () => void;
}

interface ISidebarItem {
    section?: ISidebarSection;
    title: string;
    subTitle: string;
    selected: boolean;
    status: string;

    viewType: ViewTypes;

    select(): ISidebarItem;
}