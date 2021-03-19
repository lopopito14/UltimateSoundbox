export interface IQueue {
    internalSounds: string[];
    sentSounds: string[];
    receivedSounds: string[];
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

export interface IMessage {
    sender: string,
    url: string
}