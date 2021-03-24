export interface IQueue {
    internalSounds: IInternalSound[];
    sentSounds: IExternalSound[];
    receivedSounds: IExternalSound[];
}

export interface IInternalSound {
    soundUrl: string;
}

export interface IExternalSound {
    soundUrl: string;
    sender: string;
}

export interface ISoundbox {
    bundles: IBundle[];
}

export interface IBundle {
    id: string;
    title: string;
    movies: IMovie[];
    characters: ICharacter[];
    sounds: ISound[];
}

export interface IMovie {
    id: string;
    title: string;
}

export interface ICharacter {
    id: string;
    name: string;
}

export interface ISound {
    id: string;
    movie: string;
    title: string,
    timing: string,
    quote: string,
    titleFiltered: string,
    quoteFiltered: string
}

export interface IJoinGroupMessage {
    userId: string;
    groupId: string;
}

export interface IPersonnalMessage {
    sender: string;
    url: string;
    userId: string;
}

export interface IGroupMessage {
    sender: string;
    url: string;
    groupId: string;
}

export interface IMessage {
    sender: string,
    url: string
}