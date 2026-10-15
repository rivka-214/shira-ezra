using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

class Program
{
    static bool IsBackground(byte r, byte g, byte b)
    {
        int max = Math.Max(r, Math.Max(g, b));
        int min = Math.Min(r, Math.Min(g, b));
        if (max - min > 30) return false;
        if (max < 160) return false;
        return true;
    }

    static void Main(string[] args)
    {
        string src = args[0];
        string dst = args[1];

        using (var srcBmp = new Bitmap(src))
        {
            int w = srcBmp.Width;
            int h = srcBmp.Height;
            var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (var g = Graphics.FromImage(bmp))
            {
                g.DrawImage(srcBmp, 0, 0, w, h);
            }

            var rect = new Rectangle(0, 0, w, h);
            var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int stride = data.Stride;
            int bytes = Math.Abs(stride) * h;
            byte[] px = new byte[bytes];
            Marshal.Copy(data.Scan0, px, 0, bytes);

            bool[] visited = new bool[w * h];
            var q = new Queue<int>();

            Action<int, int> tryEnqueue = (x, y) =>
            {
                if (x < 0 || y < 0 || x >= w || y >= h) return;
                int i = y * w + x;
                if (visited[i]) return;
                int o = y * stride + x * 4;
                byte b = px[o], gch = px[o + 1], r = px[o + 2];
                if (!IsBackground(r, gch, b)) return;
                visited[i] = true;
                q.Enqueue(i);
            };

            for (int x = 0; x < w; x++)
            {
                tryEnqueue(x, 0);
                tryEnqueue(x, h - 1);
            }
            for (int y = 0; y < h; y++)
            {
                tryEnqueue(0, y);
                tryEnqueue(w - 1, y);
            }

            int cleared = 0;
            while (q.Count > 0)
            {
                int i = q.Dequeue();
                int x = i % w;
                int y = i / w;
                int o = y * stride + x * 4;
                px[o] = 0;
                px[o + 1] = 0;
                px[o + 2] = 0;
                px[o + 3] = 0;
                cleared++;
                tryEnqueue(x + 1, y);
                tryEnqueue(x - 1, y);
                tryEnqueue(x, y + 1);
                tryEnqueue(x, y - 1);
            }

            Marshal.Copy(px, 0, data.Scan0, bytes);
            bmp.UnlockBits(data);
            bmp.Save(dst, ImageFormat.Png);
            bmp.Dispose();
            Console.WriteLine("OK cleared=" + cleared + " size=" + w + "x" + h + " -> " + dst);
        }
    }
}
