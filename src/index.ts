import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as _ from 'lodash';

interface RequestOptions {
  data?: object;
  url: string;
  method: AxiosRequestConfig['method'];
}

interface KASConstructorOptions {
  email: string;
  password: string;
}

export class KASApi {
  email: string;
  password: string;
  xAuthToken: string;

  constructor(options: KASConstructorOptions) {
    this.email = options.email;
    this.password = options.password;
    this.xAuthToken = '';
    this.startTokenInterval();
  }

  async getXAuthToken() {
    const { data } = await this.request({
      method: 'POST',
      url: '/users/apikey',
      data: {
        email: this.email,
        password: this.password,
      },
    });
    this.xAuthToken = data;
  }

  startTokenInterval() {
    this.getXAuthToken();
    setInterval(async () => this.getXAuthToken(), 15 * 60 * 1000);
  }

  async setClock(factoryName: string) {
    return this.request({
      url: `/lockCommand/setClock/${factoryName}`,
      method: 'PUT',
    });
  }

  async remoteUnlock(factoryName: string) {
    return this.request({
      url: `/lockCommand/remoteUnlock/${factoryName}/${this.xAuthToken}`,
      method: 'PUT',
    });
  }

  async getPasswords(factoryName: string) {
    const resp = await this.request({
      url: `/lockCommand/remotePassword/${factoryName}`,
      method: 'GET',
    });
    return resp.data.l_passwords;
  }

  async getPassword(factoryName: string, passwordId: number) {
    const passwords = await this.getPasswords(factoryName);
    return _.find(passwords, { password_id: passwordId });
  }

  // async sendPassword(factoryName: string, password_id: number) {
  //   const timeStr = 'YYYYMMDDHHmm';

  //   const now = moment();
  //   let password_start_time = moment(access_code_period_from);

  //   if (password_start_time < now) {
  //     password_start_time = now;
  //   }
  //   password_start_time = password_start_time.format(timeStr);
  //   try {
  //     const resp = await this.request({
  //       data: {
  //         password_id,
  //         password_start_time,
  //         password_end_time: moment(access_code_period_to).format(timeStr),
  //         password: access_code_id,
  //         password_name: `Newbook:${booking_id}`,
  //         email_checked: false,
  //       },
  //       url: `/lockCommand/remotePassword/${this.factoryName}`,
  //       method: 'POST',
  //     });

  //     return {
  //       ack: resp.data.ack,
  //       message: resp.data.message,
  //     };
  //   } catch (err) {
  //     return { success: false, message: err };
  //   }
  // }

  async deletePassword(factoryName: string, passwordId: number) {
    const resp = await this.request({
      data: { password_id: passwordId },
      url: `/lockCommand/remotePassword/${factoryName}`,
      method: 'DELETE',
    });
    return resp.data;
  }

  async request({ data, url, method }: RequestOptions) {
    const options: AxiosRequestConfig = {
      baseURL: 'https://cloud.kas.com.au/api',
      url,
      method,
      headers: { 'x-auth-token': this.xAuthToken },
      timeout: 0, // no timeout
      data,
    };
    return axios(options)
      .catch((err) => {
        return err.resp
      }
      
  }
}
