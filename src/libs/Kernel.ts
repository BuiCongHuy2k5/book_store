import { Service } from 'typedi';

import BootstrapProvider from '@Providers/BootstrapProvider';
import HttpProvider from '@Providers/HttpProvider';
import CacheProvider from '@Providers/CacheProvider';
import MongodbProvider from '@Providers/MongodbProvider';
import GraphqlProvider from '@Providers/GraphqlProvider';
import SocketProvider from '@Providers/SocketProvider';
import TypeORMProvider from '@Providers/TypeORMProvider';
import { ExpressAppProvider } from '@Providers/ExpressAppProvider';

export class Kernel {
  //provider register
  public static providers = [
    BootstrapProvider,
    CacheProvider,
    TypeORMProvider,
    HttpProvider,
    ExpressAppProvider,
    // GraphqlProvider,
    // MongodbProvider,
    // SocketProvider,
  ];
}
