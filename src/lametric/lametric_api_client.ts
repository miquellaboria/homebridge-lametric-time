const http = require('http');

export class lametric_api_client {
    private readonly device_ip : String;
    private readonly api_auth : String;

    constructor(ip: String, apikey : string){
        this.device_ip = ip;
        this.api_auth = 'Basic ' + Buffer.from('dev:' + apikey).toString('base64');
    }

    public sendNotification(text : String,
        priority : String, 
        icon : String,
        icon_type : String, 
        sound: String, 
        sound_category : String,
        sound_repeat : Number,
        cycles: Number){

        var msgPriority : String = 'info'
        var msgIconType : String = 'info'
        var msgSoundCategory : String = 'notifications'
        var msgSoundRepeat : Number = 1
            
        if(priority != null && priority != '')
            msgPriority = priority
        
        if(icon_type != null && icon_type != '')
            msgIconType = icon_type

        if(sound_category != null && sound_category != '')
            msgSoundCategory = msgSoundCategory

        if(sound_repeat != null && sound_repeat > 0) 
            msgSoundRepeat = sound_repeat

        var data = JSON.stringify({
            priority: msgPriority, icon_type: msgIconType, model: { cycles: cycles,  frames: [ { icon: icon, text : text } ] }
        });

        if(sound != null && sound != '')
            data = JSON.stringify({
                priority: msgPriority, icon_type: msgIconType, model: { cycles: cycles, frames: [ { icon: icon, text : text } ],
                    sound: { category: msgSoundCategory, id: sound, repeat: msgSoundRepeat }
                }
            });
          
        const options = {
            hostname: this.device_ip,
            port: 8080,
            path: '/api/v2/device/notifications',
            method: 'POST',
            headers: {
                'Authorization' : this.api_auth,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = http.request(options, (res: any) => {
          
            res.on('data', (d: any) => {
              process.stdout.write(d)
            })
          })
          
          req.on('error', (error: any) => {
            console.error(error)
          })
          
          req.write(data)
          req.end()
    }
}